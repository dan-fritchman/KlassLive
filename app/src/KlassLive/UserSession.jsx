import React, {Component} from "react";

import Tooltip from "@material-ui/core/Tooltip";

import Store from "../Store";
import KlassInSession from "./KlassInSession";
import * as AppUi from "../Store/AppUi";
import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";
import GridLayout from "./GridLayout";
import Ui from "./Ui";
import * as Sessions from "../Store/sessions";
import ProblemLayout from "./ProblemLayout";
import NotFoundContent from "../content/NotFoundContent/NotFoundContent";
import * as utils from "../utils";
import RowLayout from "./RowLayout";


export class UserSession extends Component {
    state = {error: false};

    componentDidMount = async () => {
        // We have probably loaded UserSession data by now.  But make sure.
        const user_session = await Sessions.loadUserSession(this.props.id);
        if (!user_session) return this.setState({error: true});

        const {host, user} = this.props;
        const isHost = (host.uid === user.uid);

        // Load extra klass-session details if this is the host
        if (isHost) await Sessions.reloadKlassSession();
        const controlMode = isHost ? "HOST_SESSION" : "USER_SESSION";
        AppUi.update({controlMode});
    };
    componentWillUnmount = () => AppUi.update({controlMode: null});

    render() {
        if (this.state.error) return <NotFoundContent/>;
        if (!this.props.loaded) return <LaunchScreen/>;
        const {title, host} = this.props;
        const {showName, avatarGen} = utils.userDisplay(host);

        return (<React.Fragment>
            <GridLayout>
                <ProblemLayout>
                    <RowLayout>
                        <Tooltip title={`Host ${showName}`}>
                            {avatarGen()}
                        </Tooltip>
                        <Ui.h1>{title}</Ui.h1>
                    </RowLayout>
                </ProblemLayout>
            </GridLayout>

            <KlassInSession/>

        </React.Fragment>);
    }
}

export default Store.connect(state => {
    if (!state.klass_session || !state.user_session) return {loaded: false};
    return {
        loaded: true,
        title: state.klass_session.title,
        host: state.klass_session.host,
        user: state.user,
    };
})(UserSession);

