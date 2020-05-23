import {GraphQLError} from "graphql";
import {AuthenticationError} from "apollo-server";
import GraphQLJSON from "graphql-type-json";
import mongoose from "mongoose";
import db from "./db";
import sms from "./sms";
import runner from "./runners/runner";
import Klass from "./klass";


const getSessionAndKlass = async id => {
    const klass_session = await db.models.klass_sessions.findById(id);
    if (!klass_session) throw new GraphQLError("Klass Session Not Found");
    const klass = await db.models.klass_foldeds.findById(klass_session.klass_id);
    if (!klass) throw new GraphQLError("Klass Not Found");
    return {klass_session, klass};
};

const calcAmount = (for_type, id) => {
    if (for_type !== 'SESSION') throw new GraphQLError(`Invalid Type ${for_type}`);
    return 2000;
};

export const resolvers = {
    Mutation: {
        payment_token: async (_, {for_type, id, token}, {user, loaders, stripe}) => {
            if (for_type !== 'SESSION') throw new GraphQLError(`Invalid Type ${for_type}`);

            let klassSession = await loaders.klass_sessions.load(id);
            if (!klassSession) throw new GraphQLError("Session Not Found");

            const amount = calcAmount(for_type, id);
            const charge = await stripe.charges.create({
                amount,
                currency: "usd",
                description: `Klass.Live ${for_type} #${id}`,
                source: token
            });
            if (charge.status !== 'succeeded') throw new GraphQLError(`Payment Failed`);

            // If we succeeded, update the KlassSession status
            klassSession.payment_state = "PAID";
            await klassSession.save();
            return true;
        },
        updateKlass: async () => {
            throw new AuthenticationError("Deprecated");
        },
        saveKlass: async (_, {klass}, {user}) => {
            if (!user) throw new AuthenticationError("No Authenticated User");

            const {id, ...otherData} = klass;
            let klassModel = await db.models.klass_foldeds.findById(id);

            if (!klassModel) throw new GraphQLError(`Klass Not Found: ${id}`);
            if (klassModel.ownerId !== user.uid) throw new AuthenticationError("Not Authorized");

            Object.keys(otherData).forEach(key => klassModel[key] = otherData[key]);
            klassModel.save();
            return true;
        },
        createKlass: async (root, arg, {user, loaders}) => {
            /* Create a New Klass, Owned by `user` */
            if (!user) throw new AuthenticationError("No Authenticated User");
            const userModel = await loaders.users.load(user.uid);
            if (!userModel || !userModel.hasPermission("createKlass")) {
                throw new AuthenticationError("Not Authorized")
            }
            const klass = new db.models.klass_foldeds({
                ownerId: user.uid,
                problems: [Klass.newProblem()]
            });
            userModel.klass_ids.push(klass.id);
            await userModel.save();
            await klass.save();
            return klass;
        },
        forkKlass: async (root, {klass_id}, {user, loaders}) => {
            if (!user) throw new AuthenticationError("No Authenticated User");
            const userModel = await loaders.users.load(user.uid);
            if (!userModel || !userModel.hasPermission("createKlass")) {
                throw new AuthenticationError("Not Authorized");
            }
            // Get the klass to be forked
            let origKlass = await db.models.klass_foldeds.findById(klass_id);
            if (!origKlass) throw new GraphQLError(`Klass Not Found: ${klass_id}`);

            // And do a very brute-force copy. This is just a dumb work-around of Mongoose copy-edit fun.
            let newKlass = await db.models.klass_foldeds.findById(klass_id);
            newKlass.isNew = true;
            newKlass._id = mongoose.Types.ObjectId();
            newKlass.ownerId = user.uid;

            // Give old & new refs to each other
            newKlass.forked_from = origKlass._id;
            origKlass.forks.push(newKlass._id);

            await origKlass.save();
            await newKlass.save();
            return newKlass;
        },
        updateUser: async (_, {data}, {user}) => {
            if (!user) throw new AuthenticationError("No Authenticated User");
            if (user.uid !== data.uid) throw new AuthenticationError("Not Authorized");
            return db.updateOrCreateUser(data);
        },
        nextProblem: async (_, arg, ctx) => {
            /* Increment the problem-number of klass-session-ID `arg.id` */
            if (!ctx.user) throw new AuthenticationError("No Authenticated User");
            const {id} = arg;
            let {klass_session, klass} = await getSessionAndKlass(id);

            // Only allowed by the host
            const {host_id} = klass_session;
            if (ctx.user.uid !== host_id) throw new AuthenticationError("Not Authorized");

            let {problem_num} = klass_session;
            if (!problem_num) problem_num = 0;
            const num = problem_num + 1;
            if ((num < 0) || (num > klass.num_problems - 1)) {
                throw new GraphQLError("Invalid Problem Number");
            }
            klass_session.problem_num = num;
            klass_session.save();
            return klass_session;
        },
        updateProblemNumber: async (_, arg, ctx) => {
            /* Increment the problem-number of klass-ID `arg.id` */
            if (!ctx.user) throw new AuthenticationError("No Authenticated User");

            const {id, num} = arg;
            const {klass_session, klass} = await getSessionAndKlass(id);

            // Only allowed by the host
            const {host_id} = klass_session;
            if (ctx.user.uid !== host_id) throw new AuthenticationError("Not Authorized");

            if ((num < 0) || (num > klass.num_problems - 1)) {
                throw new GraphQLError("Invalid Problem Number");
            }
            klass_session.problem_num = num;
            klass_session.save();
            return klass_session;
        },
        createKlassSession: async (root, {data}, {user, loaders}) => {
            /*  Create a new Klass Session and Save to DB */
            if (!user) throw new AuthenticationError("No Authenticated User");
            const userModel = await loaders.users.load(user.uid);
            if (!userModel || !userModel.hasPermission("hostSession")) {
                throw new AuthenticationError("Not Authorized")
            }

            const klass = await db.models.klass_foldeds.findById(data.klass_id);
            if (!klass) throw new GraphQLError(`Klass Not Found: ${data}`);

            const payment_state = userModel.hasPermission("hostFree") ? "FREE" : "UNPAID";

            let args = {...data, host_id: user.uid, klass_id: klass, payment_state,};
            if (!args.title) delete args.title;
            const klass_session = new db.models.klass_sessions(args);

            // Add a UserSession for the Host
            const host_session = await db.createUserSession(userModel, klass_session);
            return klass_session;
        },
        updateKlassSessionInfo: async (_, {data}, {user, loaders}) => {
            /*  Update Klass Session info */
            if (!user) throw new AuthenticationError("No Authenticated User");
            const userModel = await loaders.users.load(user.uid);
            if (!userModel || !userModel.hasPermission("hostSession")) {
                throw new AuthenticationError("Not Authorized")
            }
            const {id, ...otherData} = data;
            let klass_session = await loaders.klass_sessions.load(id);
            if (!klass_session) throw new GraphQLError(`KlassSession Not Found: ${data}`);

            Object.keys(otherData).forEach(key => klass_session[key] = otherData[key]);
            klass_session.save();
            return klass_session;
        },
        joinKlassSession: async (_, {data}, {user, loaders}) => {
            if (!user) throw new AuthenticationError("No Authenticated User");

            const {klass_session_id} = data;
            let klassSession = await db.models.klass_sessions.findById(klass_session_id);
            if (!klassSession) throw new GraphQLError("Klass Session Not Found");
            if (klassSession.session_state !== "ACTIVE") throw new GraphQLError("Klass Session Not Open");

            // Check for an existing UserSession
            const user_sessions = await db.models.user_sessions.find({_id: {$in: klassSession.user_sessions}}).exec();
            let userSession = user_sessions.find(s => s.user_id === user.uid);
            if (userSession) return userSession;

            // No session present - create a new one
            let userModel = await loaders.users.load(user.uid);
            userSession = await db.createUserSession(userModel, klassSession);
            return userSession;
        },

        updateKlassSessionState: async (_, {klass_session_id, state: reqState}, {user}) => {
            /* Update KlassSession.session_state */
            if (!user) throw new AuthenticationError("No Authenticated User");
            // Grab the KlassSession from DB
            let klassSession = await db.models.klass_sessions.findById(klass_session_id);
            // Only allowed by the host
            if (user.uid !== klassSession.host_id) throw new AuthenticationError("Not Authorized");

            const currentState = klassSession.session_state;

            const openIfReady = async klassSession => {
                const {payment_state} = klassSession;
                if (payment_state === "PAID" || payment_state === "FREE") {
                    klassSession.session_state = "ACTIVE";
                    if (!klassSession.times.started) {
                        klassSession.times.started = Date.now();
                    }
                    await klassSession.save();
                    return klassSession;
                } else {
                    throw new GraphQLError(`Cannot Move KlassSession ${klass_session_id} to ACTIVE`);
                }
            };

            switch (currentState) {
                case "EXPIRED": {
                    throw new GraphQLError(`KlassSession ${klass_session_id} has Expired`);
                }
                case "ACTIVE": {
                    if (reqState === "FUTURE") throw new GraphQLError(`Cannot Move KlassSession ${klass_session_id} back to FUTURE`);
                    // Otherwise, we fine to move along
                    klassSession.session_state = reqState;
                    await klassSession.save();
                    return klassSession;
                }
                case "CLOSED": {
                    if (reqState === "FUTURE") throw new GraphQLError(`Cannot Move KlassSession ${klass_session_id} back to FUTURE`);
                    if (reqState === "ACTIVE") {
                        return openIfReady(klassSession);
                    }
                    klassSession.session_state = reqState;
                    await klassSession.save();
                    return klassSession;
                }
                case "FUTURE":
                    switch (reqState) {
                        case "FUTURE": { // no-op
                            return klassSession;
                        }
                        case "CLOSED": {
                            klassSession.session_state = reqState;
                            klassSession.times.closed = Date.now();
                            await klassSession.save();
                            return klassSession;
                        }
                        case "EXPIRED": {
                            klassSession.session_state = reqState;
                            klassSession.times.expired = Date.now();
                            await klassSession.save();
                            return klassSession;
                        }
                        case "ACTIVE": { // Check whether it's ready
                            return openIfReady(klassSession);
                        }
                        default:
                            throw new GraphQLError(`Invalid KlassSessionState: ${state}`);
                    }

                default:
                    throw new GraphQLError(`Invalid KlassSessionState: ${state}`);
            }
        },

        submission: async (_, {data}, {user}) => {
            /* Create a submission from `arg.data`. */
            if (!user) throw new AuthenticationError("No Authenticated User");
            if (!runner.valid()) throw new GraphQLError("Runner Invalid");

            const {user_session_id, klass_session_id} = data;

            // Get and check the UserSession
            let user_session = await db.models.user_sessions.findById(user_session_id);
            if (!user_session) throw new GraphQLError("Session Not Found");
            if (user.uid !== user_session.user_id) throw new AuthenticationError("Not Authorized");

            // Get and check the KlassSession
            let klass_session = await db.models.klass_sessions.findById(klass_session_id);
            if (!klass_session) throw new GraphQLError("Session Not Found");
            if (klass_session.session_state !== "ACTIVE") throw new GraphQLError("Session Not Active");

            // They check out. Create the Submission
            const submission = new db.models.submissions(data);
            if (!submission) throw new GraphQLError("Error Creating Submission");

            // Give the sessions a reference to it
            user_session.submissions.push(submission.id);
            klass_session.submissions.push(submission.id);

            // And save everything
            await klass_session.save();
            await user_session.save();
            await submission.save();

            // Kick off the run-and-grade cycle, asynchronously
            const p = runner.run_and_grade(submission);
            return submission;
        },
        check_solution: async (_, {klass, problem_num}, {user}) => {
            if (!user) throw new AuthenticationError("No Authenticated User");
            if (!runner.valid()) throw new GraphQLError("Runner Invalid");

            const {id, ...otherData} = klass;
            let klassModel = await db.models.klass_foldeds.findById(id);

            if (!klassModel) throw new GraphQLError(`Klass Not Found: ${id}`);
            if (klassModel.ownerId !== user.uid) throw new AuthenticationError("Not Authorized");

            // Update the Klass in DB, i.e. save everything coming in
            Object.keys(otherData).forEach(key => klassModel[key] = otherData[key]);

            const submission = new db.models.submissions({
                klass: otherData,
                problem_num,
                source: klass.problems[problem_num].solution.source,
            });
            if (!submission) throw new GraphQLError("Error Creating Submission");

            // Give the Klass a reference to it
            klassModel.problems[problem_num].solution_result = submission.id;
            klassModel.save();
            submission.save();

            // Kick off the run-and-grade cycle, asynchronously
            const p = runner.run_and_grade(submission);
            return submission;
        },
        permission_request: async (_, {permissionTypes}, {user, loaders}) => {
            if (!user) throw new AuthenticationError("No Authenticated User");
            let userModel = await loaders.users.load(user.uid);
            if (!userModel) throw new AuthenticationError("No Authenticated User");
            for (const permType of permissionTypes) {
                console.log(permType);
                if (userModel.permissions[permType] === 'NONE') {
                    userModel.permissions[permType] = 'REQUESTED';
                }
            }
            sms(`Permission Request for ${user.email}: ${JSON.stringify(permissionTypes)}`);
            userModel.save();
            return userModel;
        },
    },
    Query: {
        klass: (_, arg) => db.models.klass_notebooks.findById(arg.id), // FIXME: rename
        klass_folded: (_, arg) => db.models.klass_foldeds.findById(arg.id),
        klass_session: (_, arg, {loaders}) => loaders.klass_sessions.load(arg.id),
        klass_setup_check: async (_, {id}, {user, loaders}) => {
            if (!user) throw new AuthenticationError("No Authenticated User");
            if (!runner.valid()) throw new GraphQLError("Runner Invalid");
            let klassModel = await loaders.klasses.load(id);
            if (!klassModel) throw new GraphQLError(`Klass Not Found: ${id}`);
            if (klassModel.ownerId !== user.uid) throw new AuthenticationError("Not Authorized");

            const solutionResults = klassModel.problems.map((prob, n) => {
                const code = prob.solution.source;
                const data = {
                    klass_id: klassModel.id,
                    klass_session_id: null,
                    user_session_id: null,
                    problem_num: n,
                    klass: klassModel,
                    source: code, //.split('\n')
                };
                const submission = new db.models.submissions(data);
                return runner.run_and_grade(submission);
            });
            await Promise.all(solutionResults);
            return {
                id,
                state: "PASSING",
                build: "PASSING",
                prompts: null,
                solutions: solutionResults,
            };
        },
        klasses: (_, {n}) => {
            if (!n) n = 10;
            return db.models.klass_foldeds
                .find({visibility: "PUBLIC"}, {}, {sort: {"_id": -1}})
                .limit(n)
                .exec();

        },
        klass_sessions: (_, {n}) => {
            if (!n) n = 10;
            return db.models.klass_sessions
                .find({visibility: "PUBLIC"}, {}, {sort: {"_id": -1}})
                .limit(n)
                .exec();
        },
        user_session: (_, arg, {loaders}) => loaders.user_sessions.load(arg.id),
        user: (_, arg, {loaders}) => loaders.users.load(arg.id),
        submission: (_, {id}, {loaders}) => loaders.submissions.load(id),
        payment_amount: (_, {for_type, id}, {user, loaders}) => calcAmount(for_type, id),
        health: () => true,
        canary: async () => {
            const inst = await db.models.canaries.findOne();
            return inst.canary;
        },
    },
    UserSession: {
        user: (obj, arg, {loaders}) => loaders.users.load(obj.user_id),
        klass_session: (obj, arg, {loaders}) => loaders.klass_sessions.load(obj.klass_session_id),
        responses: (obj, arg, {loaders}) => {
            // FIXME: allow for user & host
            const validIds = obj.response_ids.filter(id => !!id);
            return loaders.submissions.loadMany(validIds);
        },
    },
    User: {
        sessions: (obj, arg, {user, loaders}) => {
            if (!user || user.uid !== obj.uid) throw new AuthenticationError("Not Authorized");
            const validIds = obj.session_ids.filter(id => !!id);
            return loaders.user_sessions.loadMany(validIds);
        },
        klasses: (obj, arg, {user, loaders}) => {
            if (!user || user.uid !== obj.uid) throw new AuthenticationError("Not Authorized");
            const validIds = obj.klass_ids.filter(id => !!id);
            return loaders.klasses.loadMany(validIds);
        },
    },
    KlassSession: {
        klass: (obj) => db.models.klass_foldeds.findById(obj.klass_id),
        host: (obj, arg, {loaders}) => loaders.users.load(obj.host_id),
        user_sessions: (obj, arg, {loaders}) => loaders.user_sessions.loadMany(obj.user_sessions),
    },
    KlassNotebook: {
        owner: (klass, arg, {loaders}) => loaders.users.load(klass.ownerId)
    },
    KlassFolded: {
        owner: (klass, arg, {loaders}) => loaders.users.load(klass.ownerId),
    },
    Cell: {
        submission: (_, {id}, {loaders}) => {
            if (!id) return null;
            return loaders.submissions.load(id)
        },
    },
    JSON: GraphQLJSON
};
