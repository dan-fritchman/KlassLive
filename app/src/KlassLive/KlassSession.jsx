import React from "react";

import JoinSession from "./Join";
import ClosedKlassSession from "./ClosedSession";
import UserSession from "./UserSession";
import UpcomingSession from "./UpcomingSession";

import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";
import Store from "../Store";
import * as Sessions from "../Store/sessions";
import * as AppUi from "../Store/AppUi";
import NotFoundContent from "../content/NotFoundContent/NotFoundContent";


class SessionSwitcher extends React.Component {
    render() {
        /* Session Type & State Switcher
         * Changing these three big props re-renders more or less everything. */
        const {user, session_state, user_session_id, klass_session_id} = this.props;
        switch (session_state) {
            case "FUTURE":
                return <UpcomingSession/>;
            case "CLOSED":
            case "EXPIRED":
                return <ClosedKlassSession/>;
            case "ACTIVE":
                if (user && user_session_id) {
                    return <UserSession id={user_session_id}/>;
                }
                return <JoinSession id={klass_session_id}/>;
            default:
                return <NotFoundContent/>;
        }
    }
}

SessionSwitcher = Store.connect(state => {
    return {
        user: state.user,
        session_state: state.klass_session && state.klass_session.session_state,
        klass_session_id: state.klass_session && state.klass_session.id,
        user_session_id: state.user_session && state.user_session.id,
    }
})(SessionSwitcher);

class KlassSession extends React.Component {
    /* Session Matching & Routing Logic,
     * doling out URLs of the form `session/:id` to one of:
     *  - A "Join" UI, or
     *  - A User-Session UI, or
     *  - A Host UI  */

    state = {loaded: false, error: false};
    intervalId = null;
    isHost = false;
    REFRESH_PERIOD = 5000;

    autoReload = async () => {
        // Reload KlassSession data from server, and re-schedule ourselves
        const {id} = this.props;
        await Sessions.loadKlassSession(id, this.isHost);
        this.intervalId = setTimeout(this.autoReload, this.REFRESH_PERIOD);
    };
    componentDidMount = async () => {
        await Sessions.reset();
        this.isHost = false;
        const {id, user} = this.props;
        if (!id) return this.setStateError();

        const klass_session = await Sessions.loadKlassSession(id);
        if (!klass_session) return this.setStateError();

        // FIXME: this block here does "auto join".  Do we want it?  Or make users hit the "Join" button?
        if (user) {
            const {user_sessions} = klass_session;
            const user_session = user_sessions.find(s => s.user.uid === user.uid);
            if (user_session) await Sessions.loadUserSession(user_session.id);

            // Check whether this is the host.  And if so, load KlassSession details.
            this.isHost = user.uid === klass_session.host.uid;
            if (this.isHost) await Sessions.loadKlassSession(id, true);
        }
        // Set up background reload
        this.intervalId = setTimeout(this.autoReload, this.REFRESH_PERIOD);
        this.setState({loaded: true});
    };
    componentWillUnmount = () => {
        if (this.intervalId) clearTimeout(this.intervalId);
        AppUi.update({controlMode: null});
    };
    setStateError = () => {
        if (this.intervalId) clearTimeout(this.intervalId);
        AppUi.disableDrawers();
        this.setState({error: true});
    };

    render() {
        if (this.state.error) return <NotFoundContent/>;
        if (!this.state.loaded) return <LaunchScreen/>;
        return <SessionSwitcher/>;
    }
}

export default Store.connectUser(KlassSession);
