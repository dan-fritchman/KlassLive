import React from "react";

import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/icons/List";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Replay from "@material-ui/icons/Replay";

import * as AppUi from "../Store/AppUi";
import * as Sessions from "../Store/sessions";
import {getEventValue} from "../utils";


const openScoreboardDialog = () => AppUi.openDialog("scoreboard");

export class UserSessionControls extends React.Component {

    render() {
        return <React.Fragment>

            <Tooltip title={"Submit"} enterDelay={300}>
                <div><IconButton onClick={getEventValue(Sessions.submitResponse)}>
                    <PlayArrow/>
                </IconButton></div>
            </Tooltip>

            <Tooltip title={"Reset"} enterDelay={300}>
                <div><IconButton onClick={getEventValue(Sessions.resetResponse)}>
                    <Replay/>
                </IconButton></div>
            </Tooltip>

            <Tooltip title={"Scoreboard"} enterDelay={300}>
                <div><IconButton onClick={openScoreboardDialog}>
                    <List/>
                </IconButton></div>
            </Tooltip>

        </React.Fragment>;
    }
}

