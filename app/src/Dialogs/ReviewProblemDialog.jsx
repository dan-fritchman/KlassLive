import React, {Component} from "react";
import Error from "@material-ui/icons/Error";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import Ui from "../KlassLive/Ui";
import CodeMirrorWrapper from "../CodeMirror";
import Store from "../Store";
import * as AppUi from "../Store/AppUi";
import * as utils from "../utils";
import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";


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

function GradedResponse(props) {
    const {user_session, problemNum, classes} = props;
    const {user, responses} = user_session;

    // Peel out user info
    const {showName, avatarGen} = utils.userDisplay(user);

    // Peel out submission info
    const response = responses[problemNum];
    let score = 0;
    let source = [""];
    if (response) {
        // {score, source/*, output, errs,*/} = response;
        score = response.score;
        source = response.source;
    }
    const code = source;
    const passFail = Boolean(score > 0); // FIXME

    return <Grid item container direction={"row"} alignItems="center" spacing={1} width="100%">
        <Grid item>
            {avatarGen()}
        </Grid>
        <Grid item xs={2}>
            <Box className={classes.username}>
                <Ui.h3>{showName}</Ui.h3>
            </Box>
        </Grid>
        <Grid item>
            {passFail ?
                <CheckCircle fontSize={"large"}/> :
                <Error fontSize={"large"} color="error"/>
            }
        </Grid>
        <Grid item xs={8}>
            {response ?
                <CodeMirrorWrapper
                    source={code}
                    options={{readOnly: true}}
                /> :
                <em><Ui.h3>No Response! Sad!</Ui.h3></em>
            }
        </Grid>
    </Grid>;
}

GradedResponse = withStyles(styles)(GradedResponse);

class ReviewProblemDialog extends Component {
    state = {ready: false};

    componentDidMount = async () => {
        // FIXME: whether to force-reload here. Pretty slow for now, skipping.
        // await Sessions.reloadKlassSession();
        this.setState({ready: true});
    };

    handleKeyPress = (event) => {
        const key = event.key;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        if (key === "Enter") AppUi.closeDialogs();
    };

    render() {
        if (!this.props.loaded) return null;

        const {classes, fullScreen} = this.props;
        const {user, user_sessions, problemNum} = this.props;

        return (
            <Dialog
                open
                fullWidth={true}
                maxWidth={"lg"}
                fullScreen={fullScreen}
                onClose={AppUi.closeDialogs}
                onKeyPress={this.handleKeyPress}
                className={classes.dialog}
            >
                < DialogTitle> Problem Review</DialogTitle>

                <DialogContent>
                    <Box maxWidth={"md"}>
                        {!this.state.ready && <LaunchScreen/>}
                        {this.state.ready && <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            // alignContent="flex-start"
                            alignItems="stretch"
                            spacing={2}
                            width="100%"
                        >
                            {user_sessions.map((session, idx) => (
                                <GradedResponse user_session={session} problemNum={problemNum} key={idx}/>
                            ))}
                        </Grid>}
                    </Box>
                </DialogContent>
            </Dialog>);
    }
}

ReviewProblemDialog = withStyles(styles)(ReviewProblemDialog);

export default Store.connect(state => {
    if (!state.klass_session) return {loaded: false};
    return {
        loaded: true,
        user: state.user,
        problemNum: state.klass_session.problem_num,
        user_sessions: state.klass_session.user_sessions
    };
})(ReviewProblemDialog);
