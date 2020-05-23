import Store from "./index";
import Klass from "./KlassTypes";
import Api from "../KlassLive/api";
import * as AppUi from "./AppUi";


const updateActiveCellType = (klass, action) => {
    /* Update the Cell-Type of the Active Cell */

    const activeCell = klass.cellsById[klass.activeCellId];
    if (!activeCell) return klass;

    const newActiveCell = {
        ...activeCell,
        cell_type: action.cell_type
    };

    return {
        ...klass,
        cellsById: {
            ...klass.cellsById,
            [klass.activeCellId]: newActiveCell
        }
    };
};

const updateActiveCellCode = (klass, action) => {
    /* Update the Active Cell Code/ Source */

    const activeCell = klass.cellsById[klass.activeCellId];
    if (!activeCell) return klass;

    const newActiveCell = {
        ...activeCell,
        source: action.code
    };
    return {
        ...klass,
        cellsById: {
            ...klass.cellsById,
            [klass.activeCellId]: newActiveCell
        }
    };
};

const updateActiveCellId = (klass, action) => {
    const newActiveCell = klass.cellsById[action.id];
    if (!newActiveCell) {
        console.error(`Error Updating to Unknown Cell ${action.id}`);
        return klass;
    }
    return {
        ...klass,
        activeCellId: action.id
    };
};

const getFirstCellId = klass => {
    const firstProblemId = klass.problemIds[0];
    const firstProblem = klass.problemsById[firstProblemId];
    const firstCellId = firstProblem.setup[0];
    if (!firstCellId) console.error("COULD NOT FIND FIRST CELL ID!!!");
    return firstCellId;
};


const getActiveCellAndProblem = klass => {
    /* Get `klass`'s active cell, problem, and problem-ID */

    const {activeCellId} = klass;
    const activeCell = klass.cellsById[activeCellId];
    if (!activeCell) console.error("Active Cell Not Found");

    const activeProblemId = activeCell.problemId;
    if (!activeProblemId) console.error("Active Problem ID Not Found");

    const activeProblem = klass.problemsById[activeProblemId];
    if (!activeProblem) console.error("Active Problem Not Found");

    return {activeCell, activeProblem, activeProblemId};
};

const addCell = (klass, action) => {
    /* Insert a new cell *before* the active-cell. */

    const {activeCellId} = klass;
    const {activeProblem, activeProblemId} = getActiveCellAndProblem(klass);

    const newCell = Klass.newCell();
    newCell.problemId = activeProblemId;

    const setupIndex = activeProblem.setup.findIndex(arg => arg === activeCellId);
    const newSetup = [
        ...activeProblem.setup.slice(0, setupIndex),
        newCell.getId(),
        ...activeProblem.setup.slice(setupIndex)
    ];
    const newProblem = {
        ...activeProblem,
        setup: newSetup
    };
    return {
        ...klass,
        activeCellId: newCell.getId(),
        cellsById: {
            ...klass.cellsById,
            [newCell.getId()]: newCell
        },
        problemsById: {
            ...klass.problemsById,
            [activeProblemId]: newProblem
        }
    };
};

const deleteActiveProblem = (klass, action) => {
    const {activeProblemId} = klass;
    const prob = klass.problemsById[activeProblemId];

    // Delete from the problem-ID list and dict
    const newProblemIds = klass.problemIds.filter(id => id !== activeProblemId);
    const {
        [activeProblemId]: problemBeingDropped,
        ...newProblemsById
    } = klass.problemsById;

    // Drop cells
    const probCellIds = prob.setup.concat([prob.prompt, prob.solution, prob.tests]);
    const newCellsById = Object.keys(klass.cellsById)
        .filter(key => !probCellIds.includes(key))
        .reduce((obj, key) => {
            obj[key] = klass.cellsById[key];
            return obj;
        }, {});

    return {
        ...klass,
        problemIds: newProblemIds,
        problemsById: newProblemsById,
        cellsById: newCellsById,
        activeCellId: getFirstCellId(klass),
        activeProblemId: newProblemsById[0]
    }
};

const deleteCell = (klass, action) => {
    /* Delete the Active Cell */

    const {activeCellId} = klass;
    const {activeCell, activeProblem, activeProblemId} = getActiveCellAndProblem(klass);

    if (!(activeCell && activeProblem && activeProblemId)) {
        console.error("Error Deleting Cell");
        return klass;
    }

    // Update the problem/ setup-cells
    const {setup} = activeProblem;
    const newSetup = setup.filter(id => id !== activeCellId);
    const newProblem = {
        ...activeProblem,
        setup: newSetup
    };

    // Drop from the Cells-by-ID object
    const {[activeCellId]: cellBeingDropped, ...newCellsById} = klass.cellsById;
    return {
        ...klass,
        activeCellId: getFirstCellId(klass),
        cellsById: newCellsById,
        problemsById: {
            ...klass.problemsById,
            [activeProblemId]: newProblem
        }
    };
};

const addProblem = (klass, action) => {
    /* Add a new Problem, at end of the Klass */

    const problemStore = Klass.newProblemStore();

    return {
        ...klass,
        cellsById: {
            ...klass.cellsById,
            ...problemStore.cellsById
        },
        problemIds: klass.problemIds.concat(problemStore.id),
        problemsById: {
            ...klass.problemsById,
            [problemStore.id]: problemStore
        }
    };
};

const updateProblemTitle = (klass, action) => {
    const {problemId, title} = action;
    if (!problemId) return klass;

    const problem = klass.problemsById[problemId];
    if (!problem) return klass;

    return {
        ...klass,
        problemsById: {
            ...klass.problemsById,
            [problemId]: {
                ...problem,
                title: title
            }
        }
    }
};

const setupKlass = klass => {
    /* Do a few initialization steps before storing `klass`. */
    return {
        ...klass,
        activeCellId: getFirstCellId(klass),
        activeProblemId: klass.problemIds[0],
    };
};

export function klassReducer(klass = null, action) {
    /* Reduce our displayed Klass */

    switch (action.type) {
        case "LOAD_KLASS":
            return setupKlass(action.klass);
        case "LOAD_KLASS_SESSION":
            if (!action.klass_session || !action.klass_session.klass) return klass;
            return setupKlass(action.klass_session.klass);
        case "LOAD_USER_SESSION":
        case "LOAD_HOST_SESSION":
            const {klass_session} = action.user_session;
            if (!klass_session || !klass_session.klass) return klass;
            return setupKlass(klass_session.klass);

        case "ADD_CELL":
            return addCell(klass, action);
        case "DELETE_CELL":
            return deleteCell(klass, action);
        case "DELETE_ACTIVE_PROBLEM":
            return deleteActiveProblem(klass, action);

        case "ADD_PROBLEM":
            return addProblem(klass, action);

        case "UPDATE_ACTIVE_CELL_ID":
            return updateActiveCellId(klass, action);
        case "UPDATE_ACTIVE_CELL_TYPE":
            return updateActiveCellType(klass, action);
        case "UPDATE_ACTIVE_CELL_CODE":
            return updateActiveCellCode(klass, action);

        case "UPDATE_PROBLEM_TITLE":
            return updateProblemTitle(klass, action);

        case "UPDATE_ACTIVE_PROBLEM_ID":
            return {
                ...klass,
                activeProblemId: action.id,
            };
        case "UPDATE_KLASS_TITLE":
            return {
                ...klass,
                title: action.title,
            };
        case "UPDATE_KLASS_DESC":
            return {
                ...klass,
                desc: action.desc,
            };
        case "UPDATE_LANGUAGE":
            const {lang} = action;
            return {
                ...klass,
                runtime: {
                    ...klass.runtime,
                    lang,
                }
            };
        case "UPDATE_REQS":
            const {reqs} = action;
            return {
                ...klass,
                runtime: {
                    ...klass.runtime,
                    reqs
                }
            };
        case "UPDATE_KLASS_VISIBILITY":
            const {value} = action;
            return {
                ...klass,
                visibility: value,
            };
        case "UPDATE_SOLUTION_RESULT":
            return updateSolutionResult(klass, action);
        default:
            return klass;
    }
}

const updateSolutionResult = (klass, action) => {
    /* Update the results for Problem `action.problemNum`. */
    const problemId = klass.problemIds[action.problemNum];
    const problem = klass.problemsById[problemId];
    const solutionCell = klass.cellsById[problem.solution];

    return {
        ...klass,
        cellsById: {
            ...klass.cellsById,
            [problem.solution]: {
                ...solutionCell,
                submission: action.submission,
            }
        },
    };
};

export const saveKlass = async () => {
    /* Post a SAVE_KLASS mutation.
    Returns Boolean indication of success or failure. */

    const state = Store.getState();
    const klassStore = state.klass;
    const klassFolded = Klass.fromKlassStore(klassStore);
    // Extract non-save-input fields
    const {owner, ...klassInput} = klassFolded;

    const {data, error} = await Api.mutate({
        mutation: Api.SAVE_KLASS_MUTATION,
        variables: {klass: klassInput}
    });
    if (error || !data) {
        AppUi.openSnackbar("Error Saving Klass");
        return false;
    }
    return data;
};

export const createKlass = () => {
    /* Post an API mutation to create a new Klass.
     * Returns what comes back from API. */
    return Api.mutate({mutation: Api.CREATE_KLASS_MUTATION});
};

export const forkKlass = async () => {
    const state = Store.getState();
    const klassStore = state.klass;
    const id = klassStore.id;
    if (!id) return null;
    const json = await Api.mutate({
        mutation: Api.FORK_KLASS_MUTATION,
        variables: {klass_id: id}
    });
    if (json.errors) {
        AppUi.openSnackbar(json.errors);
        return null;
    }
    if (!json.data || !json.data.forkKlass) {
        AppUi.openSnackbar("Error Forking Klass");
        return null;
    }
    return json.data.forkKlass;
};

export const load = async id => {
    const {data, error} = await Api.getKlassFolded(id);
    if (error || !data || !data.klass_folded) {
        Store.dispatch({type: "RESET_KLASS"});
        return null;
    }
    const klassStore = Klass.storeFromKlass(data.klass_folded);
    if (!klassStore) {
        Store.dispatch({type: "RESET_KLASS"});
        return null;
    }
    Store.dispatch({type: "LOAD_KLASS", klass: klassStore});
    return klassStore;
};


export const updateKlassTitle = value => Store.dispatch({
    type: "UPDATE_KLASS_TITLE",
    title: value,
});

export const updateKlassDesc = value => Store.dispatch({
    type: "UPDATE_KLASS_DESC",
    desc: value,
});

export const updateLang = lang => Store.dispatch({
    type: "UPDATE_LANGUAGE",
    lang
});

export const updateReqs = reqs => Store.dispatch({
    type: "UPDATE_REQS",
    reqs
});

export const updateVisibility = value => Store.dispatch({
    type: "UPDATE_KLASS_VISIBILITY",
    value
});

const startPollingSubmission = (id, interval = 500, onRefresh = null, onComplete = null) => {
    async function pollingClosure() {
        const json = await Api.query({
            query: Api.SUBMISSION_QUERY,
            variables: {id}
        });
        if (json.errors || !json.data || !json.data.submission) {
            console.error(json);
            return AppUi.openSnackbar("Error Getting Submission");
        }

        const submission = json.data.submission;

        if (submission.state === "IN_PROGRESS") {
            if (onRefresh) onRefresh(submission);
            setTimeout(pollingClosure, interval);
        } else if (submission.state === "COMPLETE") {
            // Submission is complete; reload scores etc.
            if (onComplete) onComplete(submission);
            return;
        } else {
            console.error("Unknown State: ");
            console.error(submission);
        }
    }

    return setTimeout(pollingClosure, interval);
};


export const submitSolution = async problemNum => {
    /* Execute the Solution for Problem `problemNum`. */

    // "Optimistically" indicate submission pending
    Store.dispatch({type: "UPDATE_SOLUTION_RESULT", problemNum, submission: {state: "IN_PROGRESS"}});

    // And get around to actually collecting up the submission
    const state = Store.getState();

    const klass = Klass.fromKlassStore(state.klass);
    const {owner, ...klassData} = klass;

    const {data, errors} = await Api.mutate({
        mutation: Api.SUBMIT_SOLUTION_MUTATION,
        variables: {klass: klassData, problem_num: problemNum}
    });
    if (errors) {
        let msg = `Error Submitting Problem: ${errors}`;
        if (errors.toString().includes("Runner Invalid")) { 
            msg = "Contact info@klass.live if you'd like to run live!"
        }
        AppUi.openSnackbar(msg);
        Store.dispatch({type: "UPDATE_SOLUTION_RESULT", problemNum, submission: null});
        return;
    }
    const submission = data.check_solution;
    if (!submission) {
        AppUi.openSnackbar(`Error Submitting`);
        Store.dispatch({type: "UPDATE_SOLUTION_RESULT", problemNum, submission: null});
        return;
    }
    Store.dispatch({type: "UPDATE_SOLUTION_RESULT", problemNum, submission});
    const onRefresh = submission => Store.dispatch({type: "UPDATE_SOLUTION_RESULT", problemNum, submission});
    startPollingSubmission(submission.id, 500, onRefresh, onRefresh);
};
