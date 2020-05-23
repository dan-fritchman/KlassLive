import React from "react";

import {useTheme} from "@material-ui/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import SettingsDialog from "./SettingsDialog/SettingsDialog";
import CreateKlassSessionDialog from "./CreateKlassSessionDialog/CreateKlassSessionDialog";
import ReviewProblemDialog from "./ReviewProblemDialog";
import ScoreboardDialog from "./ScoreboardDialog";
import KlassInfoDialog from "./KlassInfoDialog";
import Store from "../Store";
import ConfirmSignOut from "./ConfirmSignOut";
import ConfirmOpenSession from "./ConfirmOpenSession";
import ConfirmCloseSession from "./ConfirmCloseSession";


const availableDialogs = {
    settings: SettingsDialog,
    confirmSignOut: ConfirmSignOut,
    confirmOpenSession: ConfirmOpenSession,
    confirmCloseSession: ConfirmCloseSession,
    klassInfo: KlassInfoDialog,
    createKlassSession: CreateKlassSessionDialog,
    reviewProblem: ReviewProblemDialog,
    scoreboard: ScoreboardDialog,
};

const DialogsWrapper = props => {
    /* Selector between the available Dialogs, or none of them.
     * Sets `fullScreen` attribute
     * Uses MUI's React hooks, so needs to be a function-Component. */

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
    const {dialogName} = props;

    // No dialogs open case
    if (!dialogName) return null;

    const DialogComp = availableDialogs[dialogName];
    if (!DialogComp) {
        console.error(`Unknown Dialog Requested: ${dialogName}`);
        return null;
    }
    return <DialogComp open={true} fullScreen={fullScreen}/>;
};

export default Store.connect(state => ({
    dialogName: state.ui.dialog
}))(DialogsWrapper);

