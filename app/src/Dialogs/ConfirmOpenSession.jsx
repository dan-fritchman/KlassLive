import React from "react";

import ConfirmationDialog from "./ConfirmationDialog/ConfirmationDialog";
import Store from "../Store";
import {closeDialogs} from "../Store/AppUi";
import * as Sessions from "../Store/sessions";


class ConfirmOpenSession extends React.Component {
    render() {
        const openSession = () => {
            Sessions.openKlassSession(this.props.klass_session_id);
            closeDialogs();
        };
        return <ConfirmationDialog
            open
            highlightOkButton

            title="Confirmation: Start KlassSession"
            contentText="Ready to start?  KlassSessions expire after 24 hours."
            okText="Start Now!"

            onClose={closeDialogs}
            onCancelClick={closeDialogs}
            onOkClick={openSession}
        />;
    }
}

export default Store.connect(state => ({
    klass_session_id: state.klass_session.id
}))(ConfirmOpenSession);

