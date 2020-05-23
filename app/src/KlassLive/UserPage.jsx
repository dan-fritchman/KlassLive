import React from "react";
import {Redirect} from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";

import Store from "../Store";
import * as Session from "../Store/sessions";
import * as AppUi from "../Store/AppUi";
import Api from "./api";
import NotFoundContent from "../content/NotFoundContent/NotFoundContent";
import GridLayout from "./GridLayout";

import ProblemLayout from "./ProblemLayout";
import Ui from "./Ui";
import * as utils from "../utils";

import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";
import AccountTab from "../Dialogs/SettingsDialog/AccountTab";
import * as KlassStore from "../Store/KlassStore";
import {BigList, klassItem, userSessionItem} from "./BigList";


class UserPage extends React.Component {
    state = {loaded: false, error: false, data: null};

    componentDidMount = async () => {
        Session.reset();
        AppUi.disableDrawers();

        // FIXME: probably give some general info if not
        const {user} = this.props;
        if (!user || !user.uid) return this.setState({error: true});

        const {data, errors} = await Api.query({
            query: Api.USER_DETAIL_QUERY,
            variables: {id: user.uid}
        });
        if (errors || !data.user) {
            AppUi.openSnackbar(`Error Loading User Info`);
            return this.setState({error: true});
        }
        this.setState({data: data.user, loaded: true});
    };
    componentWillUnmount = () => {
        AppUi.enableDrawers();
    };
    createKlass = async () => {
        const {data, errors} = await KlassStore.createKlass();
        if (errors || !data || !data.createKlass || !data.createKlass.id) {
            return AppUi.openSnackbar("Klass Creation & Hosting are in Limited Beta. \n" +
                "Request Access or Contact help@klass.live.");
        }
        return this.setState({redirectTo: `klass/${data.createKlass.id}`});
    };

    render() {
        if (this.state.redirectTo) return <Redirect push to={this.state.redirectTo}/>;
        if (this.state.error) return <NotFoundContent/>;
        if (!this.state.loaded) return <LaunchScreen/>;
        if (!this.props.user || !this.state.data) return <NotFoundContent/>;

        // Logged-in User Info
        const {user} = this.props;
        const {showName, avatarGen} = utils.userDisplay(user);

        // Data pulled from API
        const {data} = this.state;
        const {klasses, sessions} = data;

        // FIXME: these nulls should probably not get this far.
        const realKlasses = klasses.filter(k => k !== null);
        const realSessions = sessions.filter(s => s !== null);

        const activeSessions = realSessions.filter(s => s.klass_session.session_state === "ACTIVE");
        const pastSessions = realSessions.filter(s => s.klass_session.session_state !== "ACTIVE");

        const hostSessions = activeSessions.filter(s => s.klass_session.host.uid === user.uid);
        const participantSessions = activeSessions.filter(s => s.klass_session.host.uid !== user.uid);

        return <GridLayout>

            <ProblemLayout>
                <Grid container alignItems="center" spacing={2} width="100%">
                    <Grid item zeroMinWidth>
                        <Tooltip title={showName}>
                            {avatarGen()}
                        </Tooltip>
                    </Grid>
                    <Grid item zeroMinWidth>
                        <Ui.h1>{showName}</Ui.h1>
                    </Grid>
                </Grid>
                <AccountTab
                    user={user}
                    isPerformingAuthAction={false}
                    isVerifyingEmailAddress={false}
                />
            </ProblemLayout>

            <ProblemLayout>
                <Ui.h1>Ongoing Klass Sessions</Ui.h1>
                <BigList title={"Klass Sessions"} ifEmpty={"No Sessions"}>
                    {participantSessions.map((s, n) => userSessionItem(s, n))}
                </BigList>
            </ProblemLayout>

            <ProblemLayout>
                <Ui.h1>Hosting Sessions</Ui.h1>
                <BigList title={"Hosting Sessions"} ifEmpty={"No Sessions"}>
                    {hostSessions.map((s, n) => userSessionItem(s, n))}
                </BigList>
            </ProblemLayout>

            <ProblemLayout>
                <Ui.h1>Past Sessions</Ui.h1>
                <BigList title={"Past Klass Sessions"} ifEmpty={"No Sessions"}>
                    {pastSessions.map((s, n) => userSessionItem(s, n))}
                </BigList>
            </ProblemLayout>

            <ProblemLayout>
                <Ui.h1>Klasses</Ui.h1>
                <Fab onClick={this.createKlass}
                     color="secondary" variant="extended">
                    Create A New Klass
                </Fab>
                <BigList title={"Klasses"} ifEmpty={"No Klasses"}>
                    {realKlasses.map((s, n) => klassItem(s, n))}
                </BigList>
            </ProblemLayout>

        </GridLayout>
    }
}

export default Store.connectUser(UserPage);

