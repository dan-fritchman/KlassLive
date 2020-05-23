import React from "react";

import ConfirmationDialog from "./ConfirmationDialog/ConfirmationDialog";
import {closeDialogs} from "../Store/AppUi";
import {signOut} from "../auth";


export default class ConfirmSignOut extends React.Component {
    render() {
        const onOk = () => {
            signOut();
            closeDialogs();
        };
        return <ConfirmationDialog
            open
            highlightOkButton

            title="Confirm Sign Out"
            contentText=""
            okText="Sign Out"

            onClose={closeDialogs}
            onCancelClick={closeDialogs}
            onOkClick={onOk}
        />;
    }
}