import mongoose from "mongoose";
import DockerNames from "docker-names";


const visibilityEnum = {
    type: String,
    // default: "PUBLIC", // FIXME: re-make this the default
    enum: ["PUBLIC", "PRIVATE"]
};

const randomNameString = {
    type: String,
    default: () => DockerNames.getRandomName(false),
};

const UserSchema = new mongoose.Schema({
    uid: String,
    displayName: String,
    email: String,
    photoURL: String,
    permissions: {
        type: Object,
        default: {
            admin: "NONE",
            createKlass: "NONE",
            hostSession: "NONE",
            hostFree: "NONE",
        },
    },
    klass_ids: [mongoose.Schema.Types.ObjectId],
    session_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_session'
    }],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

UserSchema.methods.hasPermission = function (feature) {
    /* Check whether User `this` has permissions for feature `feature`. */
    return this && this.permissions && this.permissions[feature] === "GRANTED";
};

const KlassNotebookSchema = new mongoose.Schema({
    short_id: String,
    nbformat: {type: Number, default: 4},
    nbformat_minor: {type: Number, default: 2},
    cells: [Object],
    metadata: Object,
    created_at: {type: Date, default: Date.now},
});

const KlassSchemaFolded = new mongoose.Schema({
    ownerId: String, // `uid`
    title: randomNameString,
    desc: String,
    short_id: String,
    problems: [Object],
    scratch: [Object],
    metadata: Object,
    notebookMeta: Object,
    runtime: {
        lang: {type: String, default: "python"},
        img: {type: Object, default: null}, //{name: String, version: String,},
        reqs: String,
    },
    forked_from: mongoose.Schema.Types.ObjectId,
    forks: [mongoose.Schema.Types.ObjectId],
    created_at: {type: Date, default: Date.now},
    visibility: visibilityEnum,
});

const KlassSessionSchema = new mongoose.Schema({
    klass_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "klass_folded"
    },
    title: randomNameString,
    host_id: String, // FIXME: this is the `uid` mongoose.Schema.Types.ObjectId,
    state: { // FIXME: deprecate this
        type: Number,
        default: 0
    },
    problem_num: {type: Number, default: 0},
    problem_state: {
        type: Number, default: 0
    },
    session_state: {
        type: String,
        default: "FUTURE",
        enum: ["FUTURE", "ACTIVE", "CLOSED", "EXPIRED"],
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'submission'
    }],
    visibility: visibilityEnum,
    payment_state: {
        type: String,
        default: "UNPAID",
        enum: ["PAID", "UNPAID", "FREE"]
    },
    setup_state: {
        type: String,
        default: "NOT_RUN",
        enum: ["NOT_RUN", "RUNNING", "FAILING", "PASSING"]
    },
    user_sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        // ref: "user_session" // FIXME: this breaks instance creation, somehow
    }],
    times: {
        created: {type: Date, default: Date.now},
        started: Date,
        closed: Date,
        expired: Date,
        duration: Number // Number of hours
    },
    container: {
        id: String,
        version: String
    },
    created_at: {type: Date, default: Date.now}, // FIXME: remove
});

const UserSessionSchema = new mongoose.Schema({
    user_id: String, // FIXME: this is the `uid` mongoose.Schema.Types.ObjectId,mongoose.Schema.Types.ObjectId,
    klass_session_id: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'klass_session' // FIXME: somehow breaks all kinda stuff
    },
    state: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"]
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'submission'
    }],
    response_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'submission'
    }],
    scores: {
        problems: [{type: Number, default: 0}],
        total: {type: Number, default: 0}
    },
    created_at: {type: Date, default: Date.now},
});

const SubmissionSchema = new mongoose.Schema({
    state: {
        type: String,
        enum: ["IN_PROGRESS", "COMPLETE"],
        default: "IN_PROGRESS"
    },
    score: Number,
    output: String,
    errs: String,
    klass_id: { // This is used for Klass-level checks, i.e. when authors are editing
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'klass_folded'
    },
    user_session_id: { // Used for session-time submissions
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'user_session'
    },
    klass_session_id: { // Used for session-time submissions
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'klass_session'
    },
    problem_num: Number,
    source: Object, // FIXME: String
    klass: Object,
    created_at: {type: Date, default: Date.now},
    evaluated_at: {type: Date, default: null},
    evaluation: {
        hrstart: {s: Number, ns: Number},
        hrtime: {s: Number, ns: Number},
    }
});

const CanarySchema = new mongoose.Schema({
    canary: {type: Number, default: 11}
});

export const models = {
    users: mongoose.model("user", UserSchema),
    klass_foldeds: mongoose.model("klass_folded", KlassSchemaFolded),
    klass_notebooks: mongoose.model("klass_notebooks", KlassNotebookSchema),
    klasses: mongoose.model("klass", KlassNotebookSchema), // FIXME
    klass_sessions: mongoose.model("klass_session", KlassSessionSchema),
    user_sessions: mongoose.model("user_session", UserSessionSchema),
    submissions: mongoose.model("submission", SubmissionSchema),
    canaries: mongoose.model("canary", CanarySchema)
};


export async function updateOrCreateUser(data) {
    /* Update the DB-User entry for User `data`, creating it if not already present. */
    // FIXME: this generates a Mongoose deprecation warning, we can probably get rid of.
    let {uid, ...updates} = data;
    updates['updated_at'] = Date.now();
    const options = {upsert: true, new: true, setDefaultsOnInsert: true};
    const query = {uid: uid};
    return models.users.findOneAndUpdate(query, updates, options);
}

export const createUserSession = async (user, klass_session) => {
    /* Create a new UserSession, and add references to the User and KlassSession */
    await user;
    await klass_session;
    const response_ids = new Array(klass_session.num_problems).fill(null);
    const problemScores = new Array(klass_session.num_problems).fill(0);
    const userSession = await new models.user_sessions({
        user_id: user.uid,
        klass_session_id: klass_session,
        response_ids: response_ids,
        scores: {
            problems: problemScores,
            total: 0
        }
    });
    // Add a reference to our KlassSession and User counterparts
    klass_session.user_sessions.push(userSession);
    user.session_ids.push(userSession);

    // Save everything
    await userSession.save();
    await klass_session.save();
    await user.save();

    // And return the new UserSession
    return await userSession;
};

