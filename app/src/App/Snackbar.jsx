/*
 * Wrapper to grab Snackbar settings from Store.
 * */

import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

import Store from "../Store";
import * as AppUi from "../Store/AppUi";


export function SnackbarWrapper(props) {
  return <Snackbar
    onClose={AppUi.closeSnackbar}
    {...props.settings}
  />;
}

export default Store.connect(state => {
  if (!state.ui) return { open: false };
  return { settings: state.ui.snackbar };
})(SnackbarWrapper);
