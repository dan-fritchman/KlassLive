import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Ui from "./Ui";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import React from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import {withStyles} from "@material-ui/core";
import * as utils from "../utils";


const styles = theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper
    }
});

export function BigListItem(props) {
    const {showName, avatar, primary, secondary} = props;

    return <ListItem component="div" border={1}>
        <Tooltip title={showName}>
            <ListItemAvatar>{avatar}</ListItemAvatar>
        </Tooltip>

        <ListItemText>
            <Ui.h3 noWrap>{primary}</Ui.h3>
        </ListItemText>
        <ListItemSecondaryAction>
            <Ui.h5>{secondary}</Ui.h5>
        </ListItemSecondaryAction>
    </ListItem>;
}

export class BigList extends React.Component {
    render() {
        const {title, ifEmpty, children, classes} = this.props;

        const body = () => {
            const [firstChild, ...otherChildren] = children;
            return <List component={"div"} disablePadding className={classes.root}>
                {firstChild}
                {otherChildren.map((s, i) => {
                    return <React.Fragment key={i}>
                        <Divider variant="inset" component="li"/>
                        {s}
                    </React.Fragment>;
                })}
            </List>;
        };

        return <React.Fragment>
            {(children && children.length) ? body() : <Ui.h5>{ifEmpty}</Ui.h5>}
        </React.Fragment>;
    }
}

BigList = withStyles(styles)(BigList);

export const klassSessionItem = (klass_session, key) => {
    const {title, host, desc, id} = klass_session;
    const {showName, avatarGen} = utils.userDisplay(host);
    const avatar = avatarGen();
    const primary = <Ui.Link to={`/session/${id}`}>{title}</Ui.Link>;
    return <BigListItem showName={showName} avatar={avatar} primary={primary} secondary={desc} key={key}/>
};

export const userSessionItem = (user_session, key) => {
    const {klass_session} = user_session;
    return klassSessionItem(klass_session, key);
};

export const klassItem = (klass, key) => {
    const {id, owner} = klass;
    const title = klass.title || "Untitled";
    const desc = klass.desc || "";
    const {showName, avatarGen} = utils.userDisplay(owner);
    const avatar = avatarGen();
    const primary = <Ui.Link to={`/klass/${id}`}>{title}</Ui.Link>;
    return <BigListItem showName={showName} avatar={avatar} primary={primary} secondary={desc} key={key}/>
};

