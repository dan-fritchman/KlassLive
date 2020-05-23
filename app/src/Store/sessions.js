import Api from "../KlassLive/api";
import Store from "./index";
import * as AppUi from "./AppUi";
import Klass from "./KlassTypes";


export const reset = () => Store.dispatch({type: "RESET_SESSION"});
export const resetUser = () => Store.dispatch({type: "RESET_USER_SESSION"});
export const resetKlass = () => Store.dispatch({type: "RESET_KLASS_SESSION"});

export const loadUserSession = async id => {
    /* Get User-Session data from the server,
    and dispatch it to our Redux store. */
    const {data, errors} = await Api.getUserSession(id);
    if (errors || !data || !data.user_session) {
        console.error(data);
        AppUi.openSnackbar("Error Loading Session");
        Store.dispatch({type: "RESET_SESSION"});
        return null;
    }
    const userSessionData = prepUserSession(data.user_session);
    if (!userSessionData) {
        AppUi.openSnackbar("Error Loading Session");
        Store.dispatch({type: "RESET_SESSION"});
        return null;
    }
    Store.dispatch({type: "LOAD_USER_SESSION", user_session: userSessionData});
    return userSessionData;
};

export const loadKlassSession = async (id, detail) => {
    /* Load KlassSession `id` from the GQL API into the Store. */

    const query = detail ?
        Api.KLASS_SESSION_DETAIL_QUERY :
        Api.KLASS_SESSION_STATE_QUERY;
    const json = await Api.query({
        query,
        variables: {id},
        fetchPolicy: "network-only" // No Cached Data Allowed!
    });
    if (json.errors || !json.data || !json.data.klass_session) {
        AppUi.openSnackbar("Error Connecting to Klass Session");
        reset();
        return null;
    }
    const {klass_session} = json.data;
    Store.dispatch({type: "LOAD_KLASS_SESSION", klass_session});
    return klass_session;
};

export const reloadKlassSession = async () => {
    /* Reload the KlassSession in `state.klass_session`. */
    const state = Store.getState();
    const {user, klass_session} = state;
    const klassSessionId = klass_session.id;
    if (!klassSessionId) return console.error("NO KLASS SESSION ID!!!");

    // Host gets extra details
    const detail = user && user.uid === klass_session.host.uid;

    // FIXME: health/ perf checks inline here
    const healthData = await Api.query({query: Api.HEALTH_QUERY});
    const canaryData = await Api.query({query: Api.CANARY_QUERY});

    return await loadKlassSession(klassSessionId, detail);
};


export const klassSessionReducer = (state = null, action) => {
    switch (action.type) {
        case "LOAD_KLASS_SESSION":
            const {klass, ...rest} = action.klass_session;
            return rest;
        case "LOAD_USER_SESSION":
        case "LOAD_HOST_SESSION":
            const {klass_session} = action.user_session;
            const {klass_, ...rest_} = klass_session;
            return rest_;
        case "RE_RENDER_SESSION":
            return {...state, reRenderSession: !state.reRenderSession};
        case "RESET_SESSION":
        case "RESET_KLASS_SESSION":
            return null;
        case "UPDATE_SESSION_VISIBILITY":
            const {value} = action;
            return {
                ...state,
                visibility: value,
            };
        default:
            return state;
    }
};

export const userSessionReducer = (state = null, action) => {
    switch (action.type) {
        case "LOAD_USER_SESSION":
        case "LOAD_HOST_SESSION": // FIXME: should this be different? Not so far.
            return loadUserSessionAction(state, action);
        case "RESET_SESSION":
        case "RESET_USER_SESSION":
            return null;

        case "UPDATE_RESPONSE":
            const {problemNum, source} = action;
            let newResponses = [...state.responses];
            newResponses[problemNum] = source;
            return {
                ...state,
                responses: newResponses
            };
        case "ADD_SUBMISSION":
            const {problemNum: num, submission} = action;
            let newSubmissions = [...state.submissions];
            newSubmissions[num] = submission;
            return {
                ...state,
                submissions: newSubmissions
            };

        default:
            return state;
    }
};

const loadUserSessionAction = (state, action) => {
    /* Load the user-session in `action.session` */

    const {user_session} = action;
    const {klass_session, responses} = user_session;
    const {klass} = klass_session;

    // Load the default responses, i.e. the prompts, for no-response problems
    let storeResponses = [];
    let storeSubmissions = [];
    for (const [index, problemId] of klass.problemIds.entries()) {
        if (responses[index]) {
            storeSubmissions[index] = responses[index];
            storeResponses[index] = responses[index].source;
        } else {
            storeSubmissions[index] = null;
            const problem = klass.problemsById[problemId];
            const promptCellId = problem.prompt;
            const promptCell = klass.cellsById[promptCellId];
            storeResponses[index] = promptCell.source;
        }
    }

    return {
        id: user_session.id,
        responses: storeResponses,
        submissions: storeSubmissions
    };
};

const prepUserSession = userSessionFolded => {
    /* Convert the "folded" session-format that comes back from GQL API,
     * into the in-memory stuff we want in the store.
     * Particularly updates the `klass` field.  Maybe offload to there some day. */
    // Convert the Klass from notebook-format to in-mem format.
    return {
        ...userSessionFolded,
        klass_session: {
            ...userSessionFolded.klass_session,
            klass: Klass.storeFromKlass(userSessionFolded.klass_session.klass)
        }
    };
};

export const joinKlassSession = async (klass_session_id, user) => {
    /* Join the KlassSession with id `klass_session_id`. */
    const user_id = user.uid;
    const {data, error} = await Api.joinKlassSession({
        klass_session_id,
        user_id // FIXME: ditch
    });
    if (error || !data || !data.joinKlassSession) {
        AppUi.openSnackbar("Error Joining Klass");
        return null;
    }
    const userSessionData = prepUserSession(data.joinKlassSession);
    if (!userSessionData) {
        AppUi.openSnackbar("Error Joining Klass");
        return null;
    }
    Store.dispatch({type: "LOAD_USER_SESSION", user_session: userSessionData});
    return userSessionData;
};


export const updateKlassSessionInfo = async (id, visibility) => {
    /* Post an API mutation to set KlassSession `id` to session_state `state` */

    // "Optimistically" update the store.  Errors get washed on refresh.
    Store.dispatch({type: "UPDATE_SESSION_VISIBILITY", value: visibility});

    // Post the changes via API
    const {data, errors} = await Api.mutate({
        mutation: Api.UPDATE_KLASS_SESSION_MUTATION,
        variables: {data: {id, visibility}}
    });
    if (errors || !data || !data.updateKlassSessionInfo) {
        return AppUi.openSnackbar("Error Updating KlassSession");
    }
    Store.dispatch({type: "LOAD_KLASS_SESSION", klass_session: data.updateKlassSessionInfo});
    reRenderSession();
};

export const updateKlassSessionState = async (id, state) => {
    /* Post an API mutation to set KlassSession `id` to session_state `state` */
    if (!id) {
        const state = Store.getState();
        if (!state.klass_session && state.klass_session.id) {
            return AppUi.openSnackbar("Error Updating KlassSession");
        }
        id = state.klass_session.id;
    }
    const {data, errors} = await Api.mutate({
        mutation: Api.UPDATE_KLASS_SESSION_STATE_MUTATION,
        variables: {klass_session_id: id, state}
    });
    if (errors || !data || !data.updateKlassSessionState) {
        return AppUi.openSnackbar("Error Updating KlassSession");
    }
    const {updateKlassSessionState} = data;
    Store.dispatch({type: "LOAD_KLASS_SESSION", klass_session: updateKlassSessionState});
    reRenderSession();
};

export const openKlassSession = id => updateKlassSessionState(id, "ACTIVE");
export const closeKlassSession = id => updateKlassSessionState(id, "CLOSED");

export const reRenderSession = () => Store.dispatch({type: "RE_RENDER_SESSION"});

const startPollingSubmission = (id, problemNum) => {
    async function pollingClosure() {
        const submission = await Api.querySubmission(id);
        if (!submission) {
            return AppUi.openSnackbar("Error Getting Submission");
        }
        Store.dispatch({type: "ADD_SUBMISSION", problemNum, submission});
        if (submission.state === "IN_PROGRESS") {
            setTimeout(pollingClosure, 500);
        } else if (submission.state === "COMPLETE") {
            // Submission is complete; reload scores etc.
            return reloadKlassSession();
        } else {
            console.error("Unknown State: ");
            console.error(submission);
        }
    }

    return setTimeout(pollingClosure, 500);
};

export const submitResponse = async problemNum => {
    /* Submit the Response for Problem `problemNum`. */

    // "Optimistically" indicate submission pending
    Store.dispatch({type: "ADD_SUBMISSION", problemNum, submission: {state: "IN_PROGRESS"}});

    // And get around to actually collecting up the submission
    const state = Store.getState();
    if (!problemNum) problemNum = state.klass_session.problem_num;

    const klass = Klass.fromKlassStore(state.klass);
    const {owner, ...klassData} = klass;

    const args = {
        user_session_id: state.user_session.id,
        klass_session_id: state.klass_session.id,
        problem_num: problemNum,
        klass: klassData,
        source: state.user_session.responses[problemNum]
    };
    const {data, errors} = await Api.mutate({
        mutation: Api.SUBMIT_PROBLEM_MUTATION,
        variables: {data: args}
    });
    if (errors) {
        let msg = `Error Submitting Problem: ${errors}`;
        if (errors.toString().includes("Runner Invalid")) { 
            msg = "Contact info@klass.live if you'd like to run live!"
        }
        AppUi.openSnackbar(msg);
        return;
    }
    const {submission} = data;
    if (!submission) {
        AppUi.openSnackbar(`Error Submitting`);
        return;
    }
    Store.dispatch({type: "ADD_SUBMISSION", problemNum, submission});
    startPollingSubmission(submission.id, problemNum);
};


export const resetResponse = problemNum => {
    /* Reset Response to the Prompt for Problem `problemNum`. */

    const state = Store.getState();
    if (!problemNum) problemNum = state.klass_session.problem_num;

    // Get the prompt's code
    const problemId = state.klass.problemIds[problemNum];
    const prob = state.klass.problemsById[problemId];
    const prompt = state.klass.cellsById[prob.prompt];
    const promptSource = prompt.source;

    // Set the response for `problemNum`, equal to the prompt
    Store.dispatch({type: "UPDATE_RESPONSE", problemNum, source: promptSource});
};
