import React, {Component} from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import {withStyles} from "@material-ui/core";

import Ui from "./Ui";
import Store from "../Store";
import * as utils from "../utils";


const styles = theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper
    }
});

function Score(props) {
    const {user_session} = props;
    const {user, scores} = user_session;
    const {showName, avatarGen} = utils.userDisplay(user);

    return <ListItem component="div" border={1}>
        <ListItemAvatar>
            {avatarGen()}
        </ListItemAvatar>
        <ListItemText>
            <Ui.h4 noWrap>{showName}</Ui.h4>
        </ListItemText>
        <ListItemSecondaryAction>
            <Ui.h4>{scores.total}</Ui.h4>
        </ListItemSecondaryAction>
    </ListItem>;
}

class Scoreboard extends Component {
    render() {
        const {user_sessions, classes} = this.props;
        if (!user_sessions) return null;

        const sortedSessions = [...user_sessions].sort((a, b) => {
            if (a.scores.total < b.scores.total) return 1;
            if (a.scores.total > b.scores.total) return -1;
            return 0;
        });
        const scores = sortedSessions.map((u, n) => <Score user_session={u} key={n}/>);
        const [firstScore, ...otherScores] = scores;

        return <List component={"div"} disablePadding className={classes.root}>
            <ListItem component={"div"} inset={"true"}>
                <ListItemText>
                    <Ui.h3>Scoreboard</Ui.h3>
                </ListItemText>
            </ListItem>
            {firstScore}
            {otherScores.map((s, i) => {
                return <React.Fragment key={i}>
                    <Divider variant="inset" component="li"/>
                    {s}
                </React.Fragment>;
            })}
        </List>;
    }
}

Scoreboard = Store.connect(state => ({
    user_sessions: state.klass_session && state.klass_session.user_sessions
}))(Scoreboard);

export default withStyles(styles)(Scoreboard);

