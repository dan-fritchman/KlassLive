import React from "react";

import KlassEditor from "./KlassEditor";
import KlassViewer from "./KlassViewer";
import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";
import NotFoundContent from "../content/NotFoundContent/NotFoundContent";
import Store from "../Store";
import * as AppUi from "../Store/AppUi";
import * as Session from "../Store/sessions";
import * as KlassStore from "../Store/KlassStore";


class KlassRouter extends React.Component {
    /* Klass Routing Logic, to either Editor or ReadOnly */

    state = {loaded: false, error: false, isOwner: false};

    componentDidMount = async () => {
        /* Load our Klass, and determine whether to allow edits */
        const {id} = this.props;
        if (!id) return this.setState({error: true});

        /* Load our klass data */
        await Session.reset();
        const klass = await KlassStore.load(id);
        if (!klass) return this.setState({error: true});

        /* Sort out whether the User is the Klass Owner */
        const {user} = this.props;
        if (!user) return this.setState({isOwner: false, loaded: true});
        const {owner} = klass;
        if (!owner) return this.setState({isOwner: false, loaded: true});
        if (owner.uid === user.uid) return this.setState({isOwner: true, loaded: true});
        return this.setState({isOwner: false, loaded: true});
    };
    componentWillUnmount = () => {
        AppUi.update({controlMode: null});
    };

    render() {
        if (this.state.error) return <NotFoundContent/>;
        if (!this.state.loaded) return <LaunchScreen/>;
        if (this.state.isOwner) return <KlassEditor/>;
        return <KlassViewer/>;
    }
}

export default Store.connect(state => ({user: state.user}))(KlassRouter);

