import React, {Component} from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import {withStyles} from "@material-ui/core/styles";

import CenterLayout from "../CenterLayout";


const styles = (theme) => ({
    circularProgress: {
        position: "absolute",
        top: "50%",
        left: "50%"
    }
});

class LaunchScreen extends Component {
    render() {
        const {classes} = this.props;
        return <CenterLayout>
            <CircularProgress className={classes.circularProgress}/>
        </CenterLayout>;
    }
}

LaunchScreen.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LaunchScreen);

