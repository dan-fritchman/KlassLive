import React from "react";
import CodeIcon from "@material-ui/icons/Code";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Warning from "@material-ui/icons/Warning";
import Error from "@material-ui/icons/Error";

import CenterLayout from "../layout/CenterLayout";
import Ui from "./Ui";
import Store from "../Store";
import Scoreboard from "./Scoreboard";
import * as AppUi from "../Store/AppUi";
import * as Sessions from "../Store/sessions";
import {PaymentForm} from "../payments";
import ProblemLayout from "./ProblemLayout";
import RowLayout from "./RowLayout";


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

export class UpcomingSession extends React.Component {
    componentWillMount = () => {
        AppUi.update({controlMode: null});
        AppUi.disableDrawers();
    };
    componentWillUnmount = () => {
        AppUi.update({controlMode: null});
        AppUi.enableDrawers();
    };
    onStart = () => AppUi.openDialog("confirmOpenSession");
    onCancel = () => AppUi.openDialog("confirmCloseSession");
    hostPanel = () => {
        const {setup_state, payment_state, klass_session_id} = this.props;
        const paid = (payment_state === "FREE" || payment_state === "PAID");

        const payment_comp = () => {
            switch (payment_state) {
                case "PAID":
                    return <RowLayout>
                        <CheckCircle fontSize={"large"}/>
                        Payment: Complete
                    </RowLayout>;
                case "FREE":
                    return null;
                case "UNPAID":
                default:
                    return <React.Fragment>
                        <RowLayout>
                            <Error fontSize={"large"} color="error"/>
                            Payment: Not Completed
                        </RowLayout>

                        <PaymentForm for_type={"SESSION"} id={klass_session_id}
                                     onComplete={Sessions.reloadKlassSession}/>
                        <Button onClick={this.onCancel}>
                            Cancel Session
                        </Button>
                    </React.Fragment>
            }
        };
        const setup_comp = () => {
            switch (setup_state) {
                case "PASSING":
                    return <RowLayout>
                        <CheckCircle fontSize={"large"}/>
                        Setup Checks: Passing
                    </RowLayout>;
                case "FAILING":
                    return <RowLayout>
                        <Error fontSize={"large"}/>
                        Setup Checks: Failing
                    </RowLayout>;
                case "NOT_RUN":
                default:
                    return <RowLayout>
                        <Warning fontSize={"large"}/>
                        Setup Checks: Not Run
                    </RowLayout>;
            }
        };

        return <ProblemLayout>
            <Ui.h3>Status</Ui.h3>
            {setup_comp()}
            {payment_comp()}
            {paid && <React.Fragment>
                <Button disabled={!paid} onClick={this.onStart}>
                    Start Session
                </Button>
                <Button onClick={this.onCancel}>
                    Cancel Session
                </Button>
            </React.Fragment>}
        </ProblemLayout>
    };

    render() {
        const {title, host, user, classes, areThereUsersYet /*, times*/} = this.props;
        const isHost = (user && (user.uid === host.uid));

        return (<CenterLayout>
            <Ui.h1>Upcoming Klass Session</Ui.h1>
            <CodeIcon className={classes.emptyStateIcon} color="action"/>
            <Ui.h1>{title}</Ui.h1>
            <Ui.h3>Hosted By {host.displayName}</Ui.h3>

            {isHost && this.hostPanel()}
            {areThereUsersYet && <ProblemLayout>
                <Scoreboard/>
            </ProblemLayout>}
        </CenterLayout>);
    }
}

UpcomingSession = withStyles(styles)(UpcomingSession);

export default Store.connect(state => ({
    user: state.user,
    title: state.klass_session.title,
    host: state.klass_session.host,
    klass_session_id: state.klass_session.id,
    areThereUsersYet: state.klass_session.user_sessions.length > 0,
    setup_state: state.klass_session.setup_state,
    payment_state: state.klass_session.payment_state
}))(UpcomingSession);

