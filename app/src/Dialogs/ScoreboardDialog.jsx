import React, {Component} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {withStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";

import * as AppUi from "../Store/AppUi";
import Scoreboard from "../KlassLive/Scoreboard";


const styles = (theme) => ({
    tabs: {
        marginBottom: theme.spacing(1)
    },
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
    },
    dense: {
        marginTop: 19
    },
    menu: {
        width: 200
    },
    username: {
        overflow: "scroll",
    },
    dialog: {
        borderRadius: 12
    }
});

class ScoreboardDialog extends Component {

    handleKeyPress = (event) => {
        const key = event.key;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        if (key === "Enter") AppUi.closeDialogs();
    };

    render() {
        const {classes, fullScreen} = this.props;

        return (
            <Dialog
                open
                fullWidth={true}
                maxWidth={"xs"}
                fullScreen={fullScreen}
                onClose={AppUi.closeDialogs}
                onKeyPress={this.handleKeyPress}
                className={classes.dialog}
            >
                < DialogTitle> </DialogTitle>

                <DialogContent>
                    <Box maxWidth={"md"}>
                        <Scoreboard/>
                    </Box>
                </DialogContent>
            </Dialog>);
    }
}

export default withStyles(styles)(ScoreboardDialog);
