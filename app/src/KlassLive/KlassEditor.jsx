import React, {Component} from "react";

import Store from "../Store";
import GridLayout from "./GridLayout";
import ProblemEditor from "./ProblemEditor";
import * as AppUi from "../Store/AppUi";
import * as KlassStore from "../Store/KlassStore";

import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";
import NotFoundContent from "../content/NotFoundContent/NotFoundContent";
import KlassInfoInput from "./KlassInfoInput";


export class KlassEditor extends Component {

    state = {loaded: false, error: false};
    intervalId = null;

    componentDidMount = async () => {
        // Set up auto-saving
        this.intervalId = setInterval(KlassStore.saveKlass, 5000);
        AppUi.update({controlMode: "KLASS_EDITOR"});
        this.setState({loaded: true});
    };
    componentWillUnmount = () => {
        if (this.intervalId) clearInterval(this.intervalId);
        AppUi.update({controlMode: null});
    };

    render() {
        if (this.state.error) return <NotFoundContent/>;
        if (!this.state.loaded) return <LaunchScreen/>;

        const {problemIds} = this.props;
        if (!problemIds) return <NotFoundContent/>;

        let probComps = problemIds.map((id, index) =>
            <ProblemEditor id={id} n={index} key={id}/>);

        return <GridLayout>
            <KlassInfoInput/>
            {probComps}
        </GridLayout>;
    }
}

export default Store.connect(
    state => {
        if (!state.klass) return {};
        return {problemIds: state.klass.problemIds};
    })(KlassEditor);
