import React from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import * as Scroll from "react-scroll/modules";

import Submission from "./Submission";
import ProblemLayout from "./ProblemLayout";
import Ui from "./Ui";
import Cell from "./Cell";
import Store from "../Store";
import * as KlassStore from "../Store/KlassStore"
import * as AppUi from "../Store/AppUi";
import {getEventValue, toCapWords} from "../utils";


const SolutionSubmission = Store.connect((state, myProps) => {
    const problemId = state.klass.problemIds[myProps.problemNum];
    const problem = state.klass.problemsById[problemId];
    const solutionCell = state.klass.cellsById[problem.solution];
    return {submission: solutionCell.submission};
})(Submission);


const ProblemInfoInput = props => {
    const {title, n, onChange} = props;
    const renderTitle = title || `Problem Number ${toCapWords(n + 1)}`;
    return <React.Fragment>
        <Scroll.Element name={`${n}`}/>
        <TextField fullWidth={true}
                   margin="normal"
                   variant="outlined"
                   component={Ui.h1}
                   label={`Problem ${n + 1} Title`}
                   value={renderTitle}
                   onChange={onChange}
        /></React.Fragment>;
};

export class ProblemEditor extends React.Component {
    updateProblemTitle = title => Store.dispatch({
        type: "UPDATE_PROBLEM_TITLE",
        problemId: this.props.id,
        title: title,
    });

    makeMeActive = () => Store.dispatch({type: "UPDATE_ACTIVE_PROBLEM_ID", id: this.props.id});
    checkSolution = () => KlassStore.submitSolution(this.props.n);
    warnAndCheckSolution = () => {
        AppUi.openSnackbar(`Running Solution for Problem ${this.props.n + 1}`);
        return this.checkSolution();
    };

    render() {
        /* Render a Problem, including all setup & prompt */
        const {prob, n /*, isActive*/} = this.props;
        const {title} = prob;

        // Handled active-cell border
        // FIXME: causes the cell to shift slightly
        // FIXME: colors are too much
        // const borderOptions = (isActive) ? {
        //     border: 2,
        // borderColor: "primary.main"
        // } : {};
        const borderOptions = {};

        return <Box onClick={this.makeMeActive}>
            <ProblemLayout borderOptions={borderOptions}>
                <ProblemInfoInput onChange={getEventValue(this.updateProblemTitle)}
                                  title={title} n={n}/>

                {prob.setup.map(id => <Cell id={id} key={id} options={{readOnly: false}}
                                            onEval={this.warnAndCheckSolution}/>)}

                <Ui.h3>Prompt</Ui.h3>
                <Cell id={prob.prompt} key={prob.prompt} options={{readOnly: false}}
                      onEval={this.warnAndCheckSolution}/>

                <Ui.h3>Solution</Ui.h3>
                <Cell id={prob.solution} key={prob.solution} options={{readOnly: false}} onEval={this.checkSolution}/>
                <SolutionSubmission problemNum={n}/>

                <Ui.h3>Tests</Ui.h3>
                <Cell id={prob.tests} key={prob.tests} options={{readOnly: false}} onEval={this.warnAndCheckSolution}/>
            </ProblemLayout>
        </Box>;
    }
}

export default Store.connectProblem(ProblemEditor);

