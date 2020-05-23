import React from "react";

import Store from "../../Store";
import ActiveCellConfig from "../../KlassLive/ActiveCellConfig";
import HostControls from "../../KlassLive/HostControls";
import { UserSessionControls } from "../../KlassLive/UserSessionControls";


class Controls extends React.Component {
  render() {
    const { mode } = this.props;
    switch (mode) {
      case "KLASS_EDITOR":
        return <ActiveCellConfig/>;
      case "HOST_SESSION":
        return <HostControls/>;
      case "USER_SESSION":
        return <UserSessionControls/>;
      case "JOIN_SESSION":
      default: // Case for info pages, etc
        return null;
    }
  }
}

export default Store.connect(state => ({
  mode: state.ui.controlMode
}))(Controls);

