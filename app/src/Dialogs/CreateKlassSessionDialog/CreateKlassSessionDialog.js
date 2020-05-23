import React, {Component} from "react";
import PropTypes from "prop-types";
import {push} from "connected-react-router";

import {withStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/index";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

import Api from "../../KlassLive/api";
import Store from "../../Store";
import * as AppUi from "../../Store/AppUi";


const styles = (theme) => ({
    tabs: {
        marginBottom: theme.spacing(1)
    },
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 2000,
    },
    dense: {
        marginTop: 19
    },
    menu: {
        width: 200
    }
});


class CreateKlassSessionDialog extends Component {
    state = {
        title: null,
        start: null,
        finish: null,
        duration: 24,
        visibility: "PUBLIC"
    };

    handleKeyPress = (event) => {
        const key = event.key;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        if (key === "Enter") AppUi.closeDialogs();
    };

    onSubmit = async () => {
        const {title, start, finish, duration, visibility} = this.state;
        const {user, klass_id} = this.props;
        const times = {start, finish, duration};
        const args = {
            title: title || null,
            times,
            host_id: user.uid,
            klass_id,
            visibility
        };
        // FIXME: probably update Klass too
        const klassSession = await Api.createKlassSession(args);
        AppUi.closeDialogs();
        this.props.push(`/session/${klassSession.id}`);
    };

    render() {
        if (!this.props.loaded) return null;

        const {classes, fullScreen} = this.props;
        const {title} = this.state;
        const showTitle = title || "(Optional)";
        const titleComp = (!title) ? "em" : undefined;

        return (<Dialog open fullScreen={fullScreen} onClose={AppUi.closeDialogs} onKeyPress={this.handleKeyPress}>
                <DialogTitle>Create Klass Session</DialogTitle>

                <DialogContent>
                    <div className={classes.container}>

                        <TextField
                            fullWidth
                            component={titleComp}
                            id="title"
                            label="Title"
                            value={showTitle}
                            onChange={ev => this.setState({title: ev.target.value})}
                            className={classes.textField}
                            margin="normal"
                        />

                        <TextField
                            disabled
                            fullWidth
                            id="host_id"
                            label="Host"
                            value={this.props.user.displayName}
                            onChange={ev => this.setState({host_id: ev.target.value})}
                            className={classes.textField}
                            margin="normal"
                        />

                        <TextField
                            disabled
                            fullWidth
                            id="series"
                            label="Series"
                            value={"Coming Soon!"}
                            className={classes.textField}
                            margin="normal"
                        />

                        <TextField
                            disabled
                            fullWidth
                            id="event"
                            label="Event"
                            value={"Coming Soon!"}
                            className={classes.textField}
                            margin="normal"
                        />

                        {/*<TextField*/}
                        {/*  disabled*/}
                        {/*  id="start_at"*/}
                        {/*  label="Start @"*/}
                        {/*  value={"Now!"}*/}
                        {/*  className={classes.textField}*/}
                        {/*  margin="normal"*/}
                        {/*/>*/}

                        {/*<TextField*/}
                        {/*  disabled*/}
                        {/*  id="start-time"*/}
                        {/*  label="Start @"*/}
                        {/*  type="datetime-local"*/}
                        {/*  defaultValue="2019-01-01T12:00"*/}
                        {/*  className={classes.textField}*/}
                        {/*  InputLabelProps={{*/}
                        {/*    shrink: true*/}
                        {/*  }}*/}
                        {/*/>*/}

                        <FormControl fullWidth disabled margin="normal">
                            <InputLabel>Duration</InputLabel>
                            <Select
                                value={this.state.duration}
                                onChange={ev => this.setState({duration: ev.target.value})}
                            >
                                <MenuItem value={1}>1 Hr</MenuItem>
                                <MenuItem value={2}>2 Hr</MenuItem>
                                <MenuItem value={4}>4 Hr</MenuItem>
                                <MenuItem value={24}>24 Hr</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Visibility</InputLabel>
                            <Select
                                value={this.state.visibility}
                                onChange={ev => this.setState({visibility: ev.target.value})}
                            >
                                <MenuItem value={"PUBLIC"}>Public</MenuItem>
                                <MenuItem value={"PRIVATE"}>Private</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <DialogActions>
                        <Button color="secondary" onClick={AppUi.closeDialogs}>Cancel</Button>
                        <Button color="primary" onClick={this.onSubmit}>Create</Button>
                    </DialogActions>

                </DialogContent>
            </Dialog>
        );
    }
}

CreateKlassSessionDialog.propTypes = {
    loaded: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool,
    user: PropTypes.object.isRequired,
    klass_id: PropTypes.string.isRequired,
    klass_title: PropTypes.string,
    isPerformingAuthAction: PropTypes.bool.isRequired
};

CreateKlassSessionDialog = withStyles(styles)(CreateKlassSessionDialog);

const mapStateToProps = state => {
    if ((!state.klass) || (!state.user)) return {loaded: false};
    return {
        loaded: true,
        user: state.user,
        klass_id: state.klass.id,
        klass_title: state.klass.title,
        isPerformingAuthAction: state.ui.isPerformingAuthAction,
    };
};

export default Store.connect(mapStateToProps, {push})(CreateKlassSessionDialog);

