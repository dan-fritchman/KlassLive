import React from "react";
import Box from "@material-ui/core/Box";

import CodeMirrorWrapper from "../CodeMirror";
import Markdown from "./Markdown";
import Ui from "./Ui";
import Store from "../Store";


const dispatchCodeChange = (editor, data, value) => {
    Store.dispatch({type: "UPDATE_ACTIVE_CELL_CODE", code: value});
};

class CodeCell extends React.Component {

    render() {
        const {cell, options, isActive, onEval} = this.props;
        const {source} = cell;
        let allOptions = {...options};
        if (!isActive) {
            allOptions.readOnly = "nocursor";
        }
        let evaluateCell = onEval || null;
        if (options.readOnly) evaluateCell = null;
        return <CodeMirrorWrapper source={source}
                                  evaluateCell={evaluateCell}
                                  onBeforeChange={dispatchCodeChange}
                                  options={allOptions}/>;
    }
}

const CellOutput = props => {
    const {cell} = props;
    if (!(cell.outputs && cell.outputs.length)) {
        return null;
    }
    const output = cell.outputs[0];
    if (output.output_type !== "execute_result") {
        return null;
    }
    const output_txt = output.data["text/plain"].join("");
    // FIXME: `code` style
    // return <code>{output_txt}</code>
    return <Ui.h5>{output_txt}</Ui.h5>;
};

const CodeAndOutput = props => {
    return <div>
        <CodeCell {...props} />
        <CellOutput {...props} />
    </div>;
};

class MarkdownCell extends React.Component {
    /* Editable/ executable Markdown cell */

    state = {render: true};

    setStateRender = () => {
        this.setState({render: true});
        // const { cell } = this.props;
        // const { source } = cell;
        // if (source.trim()) this.setState({ render: true });
    };
    setStateEdit = (ev) => {
        ev.preventDefault();
        this.setState({render: false});
    };
    componentDidMount = () => {
        const {cell} = this.props;
        const {source} = cell;
        if (!source.trim()) this.setState({render: false});
    };
    onCodeChange = (editor, data, value) => {
        // if (!value.trim()) this.setState({ render: false });
        Store.dispatch({type: "UPDATE_ACTIVE_CELL_CODE", code: value});
    };

    render() {
        const {cell, options} = this.props;
        const {source} = cell;
        const overrideOptions = {lineWrapping: true, mode: "markdown"};
        const codeMirrorOptions = {...options, ...overrideOptions};
        let main;
        if (source && this.state.render) {
            let renderSource = source;
            if (!renderSource.trim()) renderSource = "{ Empty Markdown Cell }";
            main = <Markdown source={renderSource}/>;
        } else {
            main = <CodeMirrorWrapper source={source}
                                      evaluateCell={this.setStateRender}
                                      onBeforeChange={this.onCodeChange}
                                      options={codeMirrorOptions}/>;
        }
        let onDoubleClick = this.setStateEdit;
        if (options.readOnly) {
            onDoubleClick = null;
        }
        return <div onDoubleClick={onDoubleClick}>
            {main}
        </div>;
    }
}

class CellSwitcher extends React.Component {
    render() {
        const {cell} = this.props;
        const {cell_type} = cell;
        switch (cell_type) {
            case "code":
                return <CodeAndOutput {...this.props}/>;
            case "markdown":
                return <MarkdownCell{...this.props}/>;
            default:
                console.error("Unknown Cell Type: " + JSON.stringify(cell));
                return null;
        }

    }
}
class Cell extends React.Component {
    makeMeActive = () => Store.dispatch({type: "UPDATE_ACTIVE_CELL_ID", id: this.props.id});

    render() {
        const {options, isActive} = this.props;
        const onClick = options.readOnly ? null : this.makeMeActive;

        // Handled active-cell border
        // FIXME: causes the cell to shift slightly
        const borderOptions = (isActive && !options.readOnly) ? {
            border: 2,
            borderRadius: 4,
            // borderColor: "primary.main"
        } : {};

        return <Box onClick={onClick} p={1} width="100%" {...borderOptions}>
            <CellSwitcher {...this.props} />
        </Box>;
    }
}

export default Store.connect(
    (state, myProps) => {
        const cell = state.klass.cellsById[myProps.id];
        const isActive = myProps.id === state.klass.activeCellId;
        return {cell, isActive, id: myProps.id};
    })(Cell);
