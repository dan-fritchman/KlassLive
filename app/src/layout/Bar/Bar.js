import React, {Component} from "react";
import PropTypes from "prop-types";

import GitHubCircleIcon from "mdi-material-ui/GithubCircle";
import {withStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import settings from "../../settings";
import Store from "../../Store";
import Controls from "./Controls";
import ThemeToggle from "../../ThemeToggle";
import {signInWithProvider} from "../../auth";
import Ui from "../../KlassLive/Ui";
import * as AppUi from "../../Store/AppUi";
import * as utils from "../../utils";


const styles = (theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    signUpButton: {
        marginRight: theme.spacing(1)
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.primary,
        backgroundColor: theme.palette.background.default,
    }
});

export class Bar extends Component {
    state = {menu: {anchorEl: null}};

    openMenu = (event) => {
        const anchorEl = event.currentTarget;
        this.setState({menu: {anchorEl}});
    };
    closeMenu = () => {
        this.setState({menu: {anchorEl: null}});
    };
    openSignOutDialog = () => AppUi.openDialog("confirmSignOut");
    handleSignOutClick = () => {
        this.closeMenu();
        this.openSignOutDialog();
    };
    userButton = () => {
        const {isPerformingAuthAction, user} = this.props;
        const {menu} = this.state;

        const {showName, avatarGen} = utils.userDisplay(user);

        return <React.Fragment>
            <Tooltip title={showName}>
                <div><IconButton size={"small"} color="inherit" disabled={isPerformingAuthAction}
                                 onClick={this.openMenu}>
                    {avatarGen()}
                </IconButton></div>
            </Tooltip>

            <Menu anchorEl={menu.anchorEl} open={Boolean(menu.anchorEl)} onClose={this.closeMenu}>
                <MenuItem disabled={isPerformingAuthAction} onClick={this.closeMenu}>
                    {/*FIXME: probably would prefer a per-user URL*/}
                    {/*<Ui.Link to={`/user/${user.uid}`}>Account</Ui.Link>*/}
                    <Ui.Link to={`/account`}>Account</Ui.Link>
                </MenuItem>
                <MenuItem disabled={isPerformingAuthAction} onClick={this.handleSignOutClick}>Sign Out</MenuItem>
            </Menu>
        </React.Fragment>;
    };
    loginButton = () => {
        const {classes} = this.props;
        const {isPerformingAuthAction} = this.props;

        return <React.Fragment>
            <Button className={classes.gitHub}
                    disabled={isPerformingAuthAction}
                    variant="contained"
                    onClick={signInWithProvider}
            >Log in with GitHub
                <GitHubCircleIcon className={classes.icon}/>
            </Button>
        </React.Fragment>;
    };

    render() {
        const {title, user, classes} = this.props;

        return (<AppBar position="fixed" className={classes.appBar}>
            <Toolbar variant="dense">

                {/* The Site Title! */}
                <Ui.h6 style={{flexGrow: 1}}>
                    <Ui.Link to={`/`}>
                        {title}
                    </Ui.Link>
                </Ui.h6>

                {/* Modal Control-Panel */}
                <Controls/>

                {/* Theme-Toggle and User/Log-In Button */}
                <ThemeToggle/>
                {!!user ? this.userButton() : this.loginButton()}

            </Toolbar>
        </AppBar>);
    }
}

Bar.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    isPerformingAuthAction: PropTypes.bool.isRequired
};

Bar = withStyles(styles)(Bar);

export default Store.connect(state => ({
    title: settings.title,
    user: state.user,
    isPerformingAuthAction: state.ui.isPerformingAuthAction
}))(Bar);