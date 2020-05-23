import readingTime from "reading-time";
import Store from "./index";


const updateUi = (state, action) => {
    return {
        ...state,
        ...action.changes
    };
};

const initialUiState = {
    snackbar: {
        autoHideDuration: 0,
        message: "",
        open: false
    },
    dialog: null,
    isAuthReady: false,
    isPerformingAuthAction: false,
    controlMode: null,
    drawers: {
        enabled: true,
        leftOpen: true,
        rightOpen: true
    }
};

export function uiReducer(state = initialUiState, action) {
    switch (action.type) {
        case "UPDATE_UI":
            return updateUi(state, action);
        default:
            return state;
    }
}

export function update(changes) {
    Store.dispatch({type: "UPDATE_UI", changes});
}

export function openDialog(dialog) {
    return update({dialog});
}

export function closeDialogs() {
    return update({dialog: null});
}

export function openSnackbar(message) {
    return update({
        snackbar: {
            autoHideDuration: readingTime(message).time * 2,
            message,
            open: true
        }
    });
}

export function closeSnackbar() {
    return update({snackbar: {open: false}});
}

export function enableDrawers() {
    return update({drawers: {enabled: true}});
}

export function disableDrawers() {
    return update({drawers: {enabled: false}});
}
