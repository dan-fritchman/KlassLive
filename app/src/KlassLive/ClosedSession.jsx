import React from "react";
import CodeIcon from "@material-ui/icons/Code";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core";

import CenterLayout from "../layout/CenterLayout";
import Ui from "./Ui";
import Store from "../Store";
import Scoreboard from "./Scoreboard";
import * as AppUi from "../Store/AppUi";
import ProblemLayout from "./ProblemLayout";


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

export class ClosedKlassSession extends React.Component {
    componentWillMount = () => {
        AppUi.update({controlMode: null});
        AppUi.disableDrawers();
    };
    componentWillUnmount = () => {
        AppUi.update({controlMode: null});
        AppUi.enableDrawers();
    };
    hostPanel = () => {
        const {session_state} = this.props;
        switch (session_state) {
            case "CLOSED":
                const confirm = () => AppUi.openDialog("confirmOpenSession");
                return <ProblemLayout>
                    <Ui.h3>Host Controls</Ui.h3>
                    <Button onClick={confirm}>Re-Open</Button>
                </ProblemLayout>;
            case "EXPIRED":
                return <ProblemLayout>
                    <Ui.h3>Host Controls</Ui.h3>
                    This KlassSession has expired
                </ProblemLayout>;
            default:
                return null;
        }
    };

    render() {
        const {classes} = this.props;
        const {title, user, host, areThereUsersYet /*, times*/} = this.props;
        const isHost = (user && user.uid === host.uid);

        return (<CenterLayout>
            <Ui.h1>This Session is Closed</Ui.h1>
            <CodeIcon className={classes.emptyStateIcon} color="action"/>
            <Ui.h1>{title}</Ui.h1>
            <Ui.h3>Hosted By {host.displayName}</Ui.h3>

            {isHost && this.hostPanel()}
            {areThereUsersYet && <Scoreboard/>}
        </CenterLayout>);
    }
}

ClosedKlassSession = withStyles(styles)(ClosedKlassSession);

export default Store.connect(state => ({
    user: state.user,
    title: state.klass_session.title,
    host: state.klass_session.host,
    session_state: state.klass_session.session_state,
    areThereUsersYet: state.klass_session.user_sessions.length > 0,
}))(ClosedKlassSession);

