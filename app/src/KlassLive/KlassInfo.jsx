import React, {Component} from "react";

import Tooltip from "@material-ui/core/Tooltip";
import {withStyles} from "@material-ui/core/styles";

import Store from "../Store";
import Ui from "./Ui";
import ProblemLayout from "./ProblemLayout";
import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";
import * as utils from "../utils";
import RowLayout from "./RowLayout";


const styles = {};

export class KlassInfo extends Component {
    render() {
        if (!this.props.loaded) return <LaunchScreen/>;
        const {title, desc, owner} = this.props;

        const {showName, avatarGen} = utils.userDisplay(owner);
        const avatar = avatarGen();

        const renderTitle = title || "Klass Title";
        const renderDesc = desc || null;

        return <ProblemLayout>
            <RowLayout>
                <Tooltip title={`Owner ${showName}`}>
                    {avatar}
                </Tooltip>
                <Ui.h1>{renderTitle}</Ui.h1>
            </RowLayout>
            {renderDesc}
        </ProblemLayout>
    }
}

KlassInfo = withStyles(styles)(KlassInfo);

export default Store.connect(state => {
    if (!state.klass) return {loaded: false};
    return {
        loaded: true,
        id: state.klass.id,
        title: state.klass.title,
        desc: state.klass.desc,
        owner: state.klass.owner,
    }
})(KlassInfo);
