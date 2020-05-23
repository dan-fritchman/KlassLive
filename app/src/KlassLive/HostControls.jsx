import React from "react";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import SkipNext from "@material-ui/icons/SkipNext";
import SkipPrevious from "@material-ui/icons/SkipPrevious";
import Stop from "@material-ui/icons/Stop";
import Timer from "@material-ui/icons/Timer";
import IconButton from "@material-ui/core/IconButton";
import Group from "@material-ui/icons/Group";
import List from "@material-ui/icons/List";

import Api from "./api";
import Store from "../Store";
import * as Utils from "../utils";
import * as AppUi from "../Store/AppUi";
import * as Sessions from "../Store/sessions";


export class HostControls extends React.Component {
    state = {view: "notebook", timer: 5};

    startCountDown = () => Utils.comingSoon(); //FIXME!
    endSession = () => AppUi.openDialog("confirmCloseSession");
    prevProblem = async () => this.updateActiveProblem(this.props.problem_num - 1);
    nextProblem = async () => this.updateActiveProblem(this.props.problem_num + 1);
    updateActiveProblem = async value => {
        const {klass_session_id} = this.props;
        const klass_session = await Api.updateProblemNum(klass_session_id, value);
        if (!klass_session) {
            AppUi.openSnackbar("Error Updating Problem");
            return;
        }
        Store.dispatch({type: "LOAD_KLASS_SESSION", klass_session});
    };
    reviewProblem = () => AppUi.openDialog("reviewProblem");
    scoreboardDialog = () => AppUi.openDialog("scoreboard");
    updateTimer = (value) => this.setState({timer: value});
    updateVisibility = visibility => {
        return Sessions.updateKlassSessionInfo(this.props.klass_session_id, visibility);
    };

    render() {
        if (!this.props.loaded) return null;
        const {problem_num, num_problems} = this.props;

        const onFirstProblem = Boolean(problem_num <= 0);
        const onLastProblem = Boolean(problem_num >= num_problems - 1);
        return <React.Fragment>
            <Select value={this.props.visibility}
                    onChange={e => this.updateVisibility(e.target.value)}>
                <MenuItem value={"PUBLIC"}>Public</MenuItem>
                <MenuItem value={"PRIVATE"}>Private</MenuItem>
            </Select>

            {/*<Select disabled value={this.state.timer}*/}
            {/*        onChange={Utils.getEventValue(this.updateTimer)}>*/}
            {/*    <MenuItem value={1}>1 Min</MenuItem>*/}
            {/*    <MenuItem value={3}>3 Min</MenuItem>*/}
            {/*    <MenuItem value={5}>5 Min</MenuItem>*/}
            {/*    <MenuItem value={10}>10 Min</MenuItem>*/}
            {/*</Select>*/}

            {/*<Tooltip disabled title={"Start Countdown"} enterDelay={300}>*/}
            {/*    <div><IconButton disabled onClick={this.startCountDown}>*/}
            {/*        <Timer/>*/}
            {/*    </IconButton></div>*/}
            {/*</Tooltip>*/}

            <Tooltip title={"Previous Problem"} enterDelay={300}>
                <div><IconButton disabled={onFirstProblem} onClick={this.prevProblem}>
                    <SkipPrevious/>
                </IconButton></div>
            </Tooltip>

            <Tooltip title={"Next Problem"} enterDelay={300}>
                <div><IconButton disabled={onLastProblem} onClick={this.nextProblem}>
                    <SkipNext/>
                </IconButton></div>
            </Tooltip>

            <Tooltip title={"Scoreboard"} enterDelay={300}>
                <div><IconButton onClick={this.scoreboardDialog}>
                    <List/>
                </IconButton></div>
            </Tooltip>

            <Tooltip title={"Review Problem Responses"} enterDelay={300}>
                <div><IconButton onClick={this.reviewProblem}>
                    <Group/>
                </IconButton></div>
            </Tooltip>


            <Select value={problem_num}
                    onChange={Utils.getEventValue(this.updateActiveProblem)}>
                {[...Array(num_problems).keys()].map(
                    k => <MenuItem key={k} value={k}>{k + 1}</MenuItem>
                )}
            </Select>

            <Tooltip title={"End Session"} enterDelay={300}>
                <div><IconButton onClick={this.endSession}>
                    <Stop/>
                </IconButton></div>
            </Tooltip>

            {/*<Select value={this.state.view}*/}
            {/*        onChange={Utils.getEventValue(this.updateView)}>*/}
            {/*    <MenuItem value="notebook">Notebook</MenuItem>*/}
            {/*    <MenuItem value="slides">Slides</MenuItem>*/}
            {/*    <MenuItem value="scoreboard">Scoreboard</MenuItem>*/}
            {/*</Select>*/}

        </React.Fragment>;
    }
}

export default Store.connect(state => {
    if (!state.user_session) return {loaded: false};
    return {
        loaded: true,
        klass_session_id: state.klass_session.id,
        problem_num: state.klass_session.problem_num,
        user_session_id: state.user_session.id,
        num_problems: state.klass.problemIds.length,
        visibility: state.klass_session.visibility,
    };
})(HostControls);

