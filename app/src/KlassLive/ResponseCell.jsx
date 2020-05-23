import React from "react";

import Store from "../Store";
import CodeMirrorWrapper from "../CodeMirror";
import * as Sessions from "../Store/sessions";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";


class ResponseCell extends React.Component {
    state = {view: "PROMPT"};
    submitResponse = async () => Sessions.submitResponse(this.props.problemNum);
    onBeforeChange = (editor, data, value) => Store.dispatch({
        type: "UPDATE_RESPONSE",
        problemNum: this.props.problemNum,
        source: value
    });

    participantResponse = () => {
        if (this.props.source === null) return null; // FIXME! This should be some empty text

        const {options /*, cell,  isActive */} = this.props;
        const {source} = this.props;

        return (<CodeMirrorWrapper
            source={source}
            onBeforeChange={this.onBeforeChange}
            evaluateCell={this.submitResponse}
            options={options}
        />);
    };

    hostViewSwitch = () => {
        return <Select
            value={this.state.view}
            onChange={ev => this.setState({view: ev.target.value})}
        >
            <MenuItem value={"PROMPT"}>Prompt</MenuItem>
            <MenuItem value={"SOLUTION"}>Solution</MenuItem>
            <MenuItem value={"RESPONSE"}>Host Response</MenuItem>
        </Select>
    };

    hostResponse = () => {
        let f = this.participantResponse;
        if (this.state.view === "PROMPT") {
            f = () => (<CodeMirrorWrapper
                source={this.props.prompt.source}
                options={{...this.props.options, readOnly: true}}
            />);
        } else if (this.state.view === "SOLUTION") {
            f = () => (<CodeMirrorWrapper
                source={this.props.solution.source}
                options={{...this.props.options, readOnly: true}}
            />);
        }
        return <React.Fragment>
            {this.hostViewSwitch()}
            {f()}
        </React.Fragment>;
    };

    render() {
        if (!this.props.loaded) return null;
        const {host, user} = this.props;
        const isHost = (host.uid === user.uid);
        if (isHost) return this.hostResponse();
        return this.participantResponse();
    }
}


export default Store.connect((state, myProps) => {
    // FIXME: whether to use this "active cell ID" stuff
    if (!state.klass || !state.klass_session || !state.user_session) return {
        loaded: false,
        isActive: false,
        source: null,
    };
    const prob = state.klass.problemsById[myProps.probId];
    const prompt = state.klass.cellsById[prob.prompt];
    const solution = state.klass.cellsById[prob.solution];
    const response = state.user_session.responses[myProps.problemNum];

    return {
        loaded: true,
        host: state.klass_session.host,
        user: state.user,
        isActive: myProps.id === state.klass.activeCellId,
        source: response,
        prompt,
        solution
    };
})(ResponseCell);

