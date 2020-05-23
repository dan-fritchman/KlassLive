import React from "react";

import ConfirmationDialog from "./ConfirmationDialog/ConfirmationDialog";
import Store from "../Store";
import {closeDialogs} from "../Store/AppUi";
import * as Sessions from "../Store/sessions";


class ConfirmCloseSession extends React.Component {
    render() {
        const closeSession = () => {
            Sessions.closeKlassSession(this.props.klass_session_id);
            closeDialogs();
        };
        return <ConfirmationDialog
            open
            highlightOkButton

            title="Confirmation: Close KlassSession"
            contentText=""
            okText="Close"

            onClose={closeDialogs}
            onCancelClick={closeDialogs}
            onOkClick={closeSession}
        />;
    }
}

export default Store.connect(state => ({
    klass_session_id: state.klass_session.id
}))(ConfirmCloseSession);

