import React from "react";
import * as Scroll from 'react-scroll';

import Ui from "./Ui";
import {toCapWords} from "../utils";


export default class ProblemInfo extends React.Component {
    render() {
        const {title, n} = this.props;

        const renderTitle = title || `Problem Number ${toCapWords(n + 1)}`;

        return <React.Fragment>
            <Scroll.Element name={`${n}`}/>
            <Ui.h2>{n + 1}. {renderTitle}</Ui.h2>
        </React.Fragment>;
    }
}


