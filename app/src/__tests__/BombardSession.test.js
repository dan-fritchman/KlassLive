import * as TestUtils from "../TestUtils";
import Api from "../KlassLive/api";


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Stress Tests', () => {
    beforeAll(TestUtils.initFirebase);

    it('Bombards a KlassSession', async () => {

        const klass_session_id = "__TBD__";
        console.log("Bombardment Test: Please configure a KlassSession");
        process.exit(1);
        
        const numUsers = 20;
        const numSubmissions = 100;
        const klass_session = {id: klass_session_id};

        let userSessionPromises = [];
        for (const userNum of Array(numUsers).keys()) {
            const userSessionPromise = (async () => {

                const uid = `fakeUser${userNum}`;
                const {context, userData} = await TestUtils.getMockUser(uid);
                let json;

                json = await Api.mutate({
                    mutation: Api.UPDATE_USER_MUTATION,
                    variables: {data: userData},
                    context
                });

                console.log(klass_session_id);

                const userSessionMutation = await Api.mutate({
                    mutation: Api.CREATE_USER_SESSION_MUTATION,
                    variables: {data: {klass_session_id, user_id: uid}},
                    context,
                });

                console.log(userSessionMutation);


                const user_session = userSessionMutation.data.joinKlassSession;
                const {owner, __typename, ...klassData} = user_session.klass_session.klass;

                let nsub = 0;
                while (nsub < numSubmissions) {
                    nsub = nsub + 1;
                    const s = await (async () => {
                        console.log(`Submitting User ${userNum} Submission ${nsub}`);

                        const submissionData = {
                            user_session_id: user_session.id,
                            klass_session_id,
                            problem_num: 0,
                            klass: klassData,
                            source: ["pass"]
                        };

                        const submissionMutation = await Api.mutate({
                            mutation: Api.SUBMIT_PROBLEM_MUTATION,
                            variables: {data: submissionData},
                            context,
                        });
                        let submission = submissionMutation.data.submission;
                        let n = 1000;
                        const submissionId = submission.id;
                        while (submission.state === "IN_PROGRESS") {
                            await sleep(500);
                            n = n - 1;
                            if (!n) break;
                            const json = await Api.query({
                                query: Api.SUBMISSION_QUERY,
                                variables: {id: submissionId},
                                context
                            });
                            submission = json.data.submission;
                        }
                        if (!n) throw new Error("Submission Timed Out");
                        console.log(`Finished in ${1000 - n} cycles`);
                        return submission;
                    })();
                }
                return user_session;
            })();
            userSessionPromises.push(userSessionPromise);
        }
        const results = await Promise.all(userSessionPromises);
        console.log(results);
    }, 60 * 60 * 1000);
});

