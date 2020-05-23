import React from "react";

import Ui from "./Ui";
import Cell from "./Cell";
import Store from "../Store";
import ProblemLayout from "./ProblemLayout";
import ProblemInfo from "./ProblemInfo";


export class ProblemViewer extends React.Component {
    render() {
        /* Render a Problem, including all setup & prompt */
        const {prob, n} = this.props;
        const {title} = prob;

        return <ProblemLayout>
            <ProblemInfo title={title} n={n}/>

            {prob.setup.map(id => <Cell id={id} key={id} options={{readOnly: true}}/>)}

            <Ui.h3>Prompt</Ui.h3>
            <Cell problemNum={n} id={prob.prompt} options={{readOnly: true}}/>

            <Ui.h3>Tests</Ui.h3>
            <Cell id={prob.tests} key={prob.tests} options={{readOnly: true}}/>
        </ProblemLayout>;
    }
}

export default Store.connectProblem(ProblemViewer);

