import React, {Component} from "react";

import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";

import Store from "../Store";
import * as KlassStore from "../Store/KlassStore";
import Ui from "./Ui";
import ProblemLayout from "./ProblemLayout";
import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";
import {getEventValue} from "../utils";


const styles = theme => ({
    titleInput: {
        fontSize: "28pt",
    }
});


export class KlassInfoInput extends Component {
    render() {
        if (!this.props.loaded) return <LaunchScreen/>;
        const {id, title, desc /*, classes*/} = this.props;

        const renderTitle = title || "Klass Title";
        const renderDesc = desc || "";

        return <ProblemLayout>
            <TextField label={`Klass ${id} Title`}
                       value={renderTitle}
                       onChange={getEventValue(KlassStore.updateKlassTitle)}
                       component={Ui.h1}
                       fullWidth={true}
                       margin="normal"
                       variant="outlined"/>
            <TextField label={"Klass Description"}
                       value={renderDesc}
                       onChange={getEventValue(KlassStore.updateKlassDesc)}
                       component={Ui.h1}
                       fullWidth={true}
                       multiline={true}
                       margin="normal"
                       variant="outlined"/>
        </ProblemLayout>
    }
}

KlassInfoInput = withStyles(styles)(KlassInfoInput);

export default Store.connect(state => {
    if (!state.klass) return {loaded: false};
    return {
        loaded: true,
        id: state.klass.id,
        title: state.klass.title,
        desc: state.klass.desc,
    }
})(KlassInfoInput);
