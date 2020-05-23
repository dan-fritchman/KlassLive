import React, { Component } from "react";

import PropTypes from "prop-types";
import DialogContentText from "@material-ui/core/DialogContentText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Hidden from "@material-ui/core/Hidden";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import settings from "../../settings";
import colors from "../../colors";
import Store  from "../../Store";
import * as AppUi from "../../Store/AppUi";


const defaultTheme = settings.theme;

const styles = (theme) => ({
  root: {
    marginBottom: theme.spacing(0)
  }
});

const types = [
  "light",
  "dark"
];

export class AppearanceTab extends Component {

  updateTheme = (changes, _, callback) => {
    Store.dispatch({ type: "UPDATE_THEME", changes });
    if (callback && typeof callback === "function") {
      callback();
    }
  };

  resetTheme = () => {
    this.updateTheme({
      primaryColor: settings.theme.primaryColor.name,
      secondaryColor: settings.theme.secondaryColor.name,
      type: settings.theme.type
    }, true, () => {
      AppUi.openSnackbar("Settings reset");
    });
  };

  changePrimaryColor = (event) => {
    const primaryColor = event.target.value;

    this.updateTheme({
      primaryColor
    });
  };

  changeSecondaryColor = (event) => {
    const secondaryColor = event.target.value;

    this.updateTheme({
      secondaryColor
    });
  };

  changeThemeType = (event) => {
    const type = event.target.value;

    this.updateTheme({
      type
    });
  };

  render() {
    const { classes, primaryColor, secondaryColor, type, onClose } = this.props;

    let hasDeviatedFromDefaultSettings = false;
    if (defaultTheme) {
      hasDeviatedFromDefaultSettings = (
        primaryColor !== defaultTheme.primaryColor.name ||
        secondaryColor !== defaultTheme.secondaryColor.name ||
        type !== defaultTheme.type
      );
    }

    return (
      <React.Fragment>
        <DialogContentText classes={{ root: classes.root }}>
          The app's primary and secondary colors, and their variants, help create a color theme that is harmonious,
          ensures accessible text, and distinguishes UI elements and surfaces from one another.
        </DialogContentText>

        <FormControl fullWidth margin="normal">
          <InputLabel>Primary color</InputLabel>

          <Select onChange={this.changePrimaryColor} value={primaryColor}>
            {colors.map((color) => {
              return (<MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>);
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Secondary color</InputLabel>

          <Select onChange={this.changeSecondaryColor} value={secondaryColor}>
            {colors.map((color) => {
              return (<MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>);
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>

          <Select onChange={this.changeThemeType} value={type}>
            {types.map((type, index) => {
              return (<MenuItem key={index} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</MenuItem>);
            })}
          </Select>
        </FormControl>

        {hasDeviatedFromDefaultSettings &&
        <React.Fragment>
          <Hidden only="xs">
            <DialogActions>
              <Button color="primary" variant="contained" onClick={this.resetTheme}>Reset</Button>
            </DialogActions>
          </Hidden>

          <Hidden only={["sm", "md", "lg", "xl"]}>
            <DialogActions>
              <Button color="primary" onClick={onClose}>Cancel</Button>
              <Button color="primary" variant="outlined" onClick={this.resetTheme}>Reset</Button>
              <Button color="primary" variant="contained" onClick={onClose}>OK</Button>
            </DialogActions>
          </Hidden>
        </React.Fragment>
        }
        {!hasDeviatedFromDefaultSettings &&
        <Hidden only={["sm", "md", "lg", "xl"]}>
          <DialogActions>
            <Button color="primary" onClick={onClose}>Cancel</Button>
            <Button color="primary" variant="contained" onClick={onClose}>OK</Button>
          </DialogActions>
        </Hidden>
        }
      </React.Fragment>
    );
  }
}

AppearanceTab.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  primaryColor: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired

};

AppearanceTab = withStyles(styles)(AppearanceTab);


export default Store.connect(
  state => {
    return { ...state.theme.options };
  }
)(AppearanceTab);
