import React, {Component} from "react";

import PropTypes from "prop-types";
import moment from "moment";
import {withStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

import Ui from "../../KlassLive/Ui";


const styles = (theme) => ({
    root: {
        marginBottom: theme.spacing(0)
    },

    dialogContentTextUserComplete: {
        marginTop: theme.spacing(1)
    }
});

class AccountTab extends Component {

    render() {
        const {user, classes} = this.props;

        return (
            <React.Fragment>
                <List>

                    <ListItem>
                        <ListItemIcon>
                            <Tooltip title="Display name">
                                <PersonIcon/>
                            </Tooltip>
                        </ListItemIcon>
                        <ListItemText primary="Display name" secondary={user.displayName}/>
                    </ListItem>

                    {user.email &&
                    <ListItem>
                        <ListItemIcon>
                            <Tooltip title="E-mail address">
                                <EmailIcon/>
                            </Tooltip>
                        </ListItemIcon>
                        <ListItemText primary="E-mail address" secondary={user.email}/>
                    </ListItem>
                    }

                    {!user.email &&
                    <ListItem>
                        <ListItemIcon>
                            <Tooltip title="E-mail address">
                                <EmailIcon/>
                            </Tooltip>
                        </ListItemIcon>
                        <ListItemText primary="No e-mail address available"/>
                    </ListItem>
                    }

                    {/* FIXME: user metadata doesnt seem to load from localStorage */}
                    {user.metadata && <React.Fragment>
                        {user.metadata.lastSignInTime &&
                        <ListItem>
                            <ListItemIcon>
                                <Tooltip title="Last Sign-In">
                                    <AccessTimeIcon/>
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary="Last Sign-In"
                                          secondary={moment(user.metadata.lastSignInTime).format("LLLL")}/>
                        </ListItem>
                        }

                        {user.metadata.creationTime &&
                        <ListItem>
                            <ListItemIcon>
                                <Tooltip title="Signed Up">
                                    <AccessTimeIcon/>
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary="Signed Up"
                                          secondary={moment(user.metadata.creationTime).format("LLLL")}/>
                        </ListItem>
                        }
                    </React.Fragment>
                    }
                </List>
            </React.Fragment>
        );
    }
}

AccountTab.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    isPerformingAuthAction: PropTypes.bool.isRequired
};

export default withStyles(styles)(AccountTab);