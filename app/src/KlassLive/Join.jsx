import React from "react";
import GitHubCircleIcon from "mdi-material-ui/GithubCircle";
import CodeIcon from "@material-ui/icons/Code";
import Fab from "@material-ui/core/Fab";
import {withStyles} from "@material-ui/core";

import CenterLayout from "../layout/CenterLayout";
import Ui from "./Ui";
import Store from "../Store";
import Scoreboard from "./Scoreboard";
import * as AppUi from "../Store/AppUi";
import * as Sessions from "../Store/sessions";
import * as auth from "../auth";
import * as utils from "../utils";


const styles = (theme) => ({
    emptyStateIcon: {
        fontSize: theme.spacing(12)
    },
    button: {
        marginTop: theme.spacing(1)
    },
    buttonIcon: {
        marginRight: theme.spacing(1)
    }
});

export class JoinKlass extends React.Component {
    componentWillMount = () => {
        AppUi.update({controlMode: "JOIN_SESSION"});
        AppUi.disableDrawers();
    };
    componentWillUnmount = () => {
        AppUi.update({controlMode: null});
        AppUi.enableDrawers();
    };

    joinButtonHandler = async () => {
        const user = await auth.signInWithProvider();
        if (!user) return; // Log in fails are handled elsewhere

        const userSession = Sessions.joinKlassSession(this.props.id, user);
        if (!userSession) return AppUi.openSnackbar("Failed to Join Session");
    };

    render() {
        const {user, title, host, areThereUsersYet, classes /*, times*/} = this.props;

        let av = <GitHubCircleIcon className={classes.buttonIcon}/>;

        if (user) { // Set up avatar
            const {showName, avatarGen} = utils.userDisplay(user);
            av = avatarGen();
        }

        return (<CenterLayout>
            <CodeIcon className={classes.emptyStateIcon} color="action"/>
            <Ui.h1>{title}</Ui.h1>
            <Ui.h3>Hosted By {host.displayName}</Ui.h3>

            <Fab className={classes.button} onClick={this.joinButtonHandler} variant="extended">
                {av}
                {user ? "Join" : "Log In with GitHub to Join"}
            </Fab>

            {areThereUsersYet && <Scoreboard/>}
        </CenterLayout>);
    }
}

JoinKlass = withStyles(styles)(JoinKlass);

export default Store.connect(state => ({
    user: state.user,
    title: state.klass_session.title,
    host: state.klass_session.host,
    areThereUsersYet: state.klass_session.user_sessions.length > 0,
}))(JoinKlass);

