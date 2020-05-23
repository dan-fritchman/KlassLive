import React, {Component} from "react";

import Store from "../Store";
import GridLayout from "./GridLayout";
import ProblemInSession from "./ProblemInSession";


export class KlassInSession extends Component {
    /* Renders the Klass, when in session with an active `problemNum`.
     * Maybe "Viewer" is not the best long-term name. */

    render() {
        const {problemIds, problem_num} = this.props;
        if (!problemIds) return null;

        let probComps = problemIds.slice(0, problem_num + 1).map((id, index) =>
            <ProblemInSession id={id} n={index} key={id}/>);

        return <GridLayout>
            {probComps}
        </GridLayout>;
    }
}

export default Store.connect(state => {
    if (!state.klass) return {};
    return {
        problemIds: state.klass.problemIds,
        problem_num: state.klass_session.problem_num
    };
})(KlassInSession);

