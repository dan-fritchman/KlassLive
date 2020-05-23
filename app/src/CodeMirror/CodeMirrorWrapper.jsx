import React from "react";
import styled from "styled-components";

import CodeMirrorRaw from "./CodeMirror";
import Store from "../Store";


const codeFontSize = "14pt";

const CodeMirror = styled(props => <CodeMirrorRaw {...props} />)`
  .CodeMirror {
    font-family: monospace;
    font-size: ${codeFontSize}; 
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    pre { 
      font-size: ${codeFontSize}; 
    }
  }
`;

const extraKeys = {
    "Tab": "indentMore",
    "Shift-Tab": "indentLess",
    "Shift-Enter": null
};
const defaultOptions = {
    mode: "python",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    extraKeys
};
const codemirrorThemes = {
    dark: "base16-dark",
    light: "yeti"
};

export class CodeMirrorWrapper extends React.Component {
    // handleKeyPress = (_, e) => {
    //     /* Run cell-evaluation on Shift-Enter
    //      * Return-value dictates whether further handlers are called */
    //     if (e.key === "Enter" && e.shiftKey) {
    //         this.props.evaluateCell();
    //         return true;
    //     }
    //     return false;
    // };

    render() {
        const {source, options, useDarkTheme} = this.props;
        const {onChange, onBeforeChange, evaluateCell} = this.props;
        let allOptions = {
            ...defaultOptions,
            ...options,
            theme: useDarkTheme ? codemirrorThemes.dark : codemirrorThemes.light,
            extraKeys: {
                ...defaultOptions.extraKeys
            },
        };
        if (evaluateCell) {
            allOptions.extraKeys["Shift-Enter"] = evaluateCell;
        }
        return <CodeMirror
            value={source}
            options={allOptions}
            onChange={onChange}
            onBeforeChange={onBeforeChange}
            // onKeyDown={this.handleKeyPress}
            // onKeyUp={this.handleKeyPress}
        />;
    }
}

// CodeMirrorWrapper.defaultProps = {
//     evaluateCell: () => undefined,
//     onChange: () => undefined
// };

export default Store.connect(state => {
    const {theme} = state;
    return {
        useDarkTheme: theme && theme.options.type === 'dark'
    };
})(CodeMirrorWrapper);
