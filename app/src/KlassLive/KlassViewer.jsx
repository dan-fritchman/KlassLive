import React, {Component} from "react";

import Store from "../Store";
import GridLayout from "./GridLayout";
import ProblemViewer from "./ProblemViewer";

import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";
import NotFoundContent from "../content/NotFoundContent/NotFoundContent";
import KlassInfo from "./KlassInfo";


export class KlassViewer extends Component {
    /* Renders the Klass, as a Read-Only "View". */

    render() {
        if (!this.props.loaded) return <LaunchScreen/>;

        const {problemIds} = this.props;
        if (!problemIds) return <NotFoundContent/>;

        return <GridLayout>
            <KlassInfo/>
            {problemIds.map((id, index) =>
                <ProblemViewer id={id} n={index} key={id}/>)
            }
        </GridLayout>;
    }
}

export default Store.connect(state => {
    if (!state.klass) return {loaded: false};
    return {
        loaded: true,
        problemIds: state.klass.problemIds,
    };
})(KlassViewer);

