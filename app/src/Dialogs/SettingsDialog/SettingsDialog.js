import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Hidden from "@material-ui/core/Hidden";
import SwipeableViews from "react-swipeable-views";

import AccountTab from "./AccountTab";
import AppearanceTab from "./AppearanceTab";
import Store from "../../Store";
import { closeDialogs } from "../../Store/AppUi";


const styles = (theme) => ({
  tabs: {
    marginBottom: theme.spacing(1)
  }
});


export class SettingsDialog extends Component {
  state = { selectedTab: 0 };

  handleKeyPress = (event) => {
    const key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (key === "Enter") {
      this.props.onClose();
    }
  };

  changeTab = (event, value) => {
    this.setState({
      selectedTab: value
    });
  };

  changeIndex = (index) => {
    this.setState({
      selectedTab: index
    });
  };

  // handleResetClick = () => {
  //   const { primaryColor, secondaryColor, type, defaultTheme } = this.props;
  //
  //   if (primaryColor !== defaultTheme.primaryColor || secondaryColor !== defaultTheme.secondaryColor || type !== defaultTheme.type) {
  //     setTimeout(this.props.onResetClick, 137.5);
  //   }
  // };

  render() {
    const {
      classes,
      fullScreen,
      open,
      user,
      isPerformingAuthAction
    } = this.props;

    const { selectedTab } = this.state;

    return (
      <Dialog fullScreen={fullScreen} open={open} onClose={closeDialogs} onKeyPress={this.handleKeyPress}>
        <DialogTitle>Settings</DialogTitle>

        <Tabs className={classes.tabs} indicatorColor="primary" textColor="primary" onChange={this.changeTab}
              value={selectedTab} variant="fullWidth">
          <Tab label="Account"/>
          <Tab label="Appearance"/>
        </Tabs>

        <DialogContent>
          <Hidden only="xs">
            {selectedTab === 0 &&
            <AccountTab user={user} isPerformingAuthAction={isPerformingAuthAction}
              isVerifyingEmailAddress={false}
            />
            }

            {selectedTab === 1 &&
            <AppearanceTab onClose={closeDialogs}/>
            }
          </Hidden>

          <Hidden only={["sm", "md", "lg", "xl"]}>
            <SwipeableViews index={selectedTab} onChangeIndex={this.changeIndex}>
              <AccountTab
                user={user}
                isPerformingAuthAction={isPerformingAuthAction}
                isVerifyingEmailAddress={false}
              />

              <AppearanceTab onClose={closeDialogs}/>
            </SwipeableViews>
          </Hidden>
        </DialogContent>
      </Dialog>
    );
  }
}

SettingsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  isPerformingAuthAction: PropTypes.bool.isRequired
};

SettingsDialog = withStyles(styles)(SettingsDialog);

export default Store.connect(state => ({
  isPerformingAuthAction: state.ui.isPerformingAuthAction,
  user: state.user
}))(SettingsDialog);

