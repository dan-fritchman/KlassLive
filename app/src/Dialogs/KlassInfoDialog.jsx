import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import Api from "../KlassLive/api";
import {getEventValue} from "../utils";
import LaunchScreen from "../layout/LaunchScreen/LaunchScreen";
import * as AppUi from "../Store/AppUi";
import * as KlassStore from "../Store/KlassStore";
import Ui from "../KlassLive/Ui";
import {withStyles} from "@material-ui/core";
import Store from "../Store";


export const styles = (theme) => ({
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
        width: 2000
    },
    dense: {
        marginTop: 19
    },
    menu: {
        width: 200
    }
});


export class KlassInfoDialog extends React.Component {
    state = {checks: null};

    runChecks = async () => {
        const {id} = this.props;
        this.setState({checks: "PENDING"});
        const results = await Api.query({
            query: Api.KLASS_SETUP_CHECK_QUERY,
            variables: {id}
        });
        this.setState({checks: JSON.stringify(results)});
    };

    render() {
        if (!this.props.loaded) return <LaunchScreen/>;

        const {classes, fullScreen} = this.props;
        const {id, title, desc, runtime} = this.props;

        const renderTitle = title || "Klass Title";
        const renderDesc = desc || "";

        let {lang, reqs, img} = runtime;
        if (!lang) lang = "python";
        if (!reqs) reqs = "\n";

        return (<Dialog open
                        fullScreen={fullScreen}
                        onClose={AppUi.closeDialogs}
                        onKeyPress={this.handleKeyPress}>
            <DialogTitle>Klass Info</DialogTitle>

            <DialogContent>
                {/*<Button onClick={this.runChecks}>CHECK THIS</Button>*/}
                {/*{this.state.checks}*/}

                <form className={classes.container} autoComplete="off">

                    <TextField label={`Klass ${id} Title`}
                               value={renderTitle}
                               onChange={getEventValue(KlassStore.updateKlassTitle)}
                               component={Ui.h1}
                               fullWidth={true}
                               margin="normal"
                               variant="outlined"/>

                    <TextField label={"Klass Description"}
                               value={renderDesc}
                               onChange={getEventValue(KlassStore.updateKlassDesc)}
                               component={Ui.h1}
                               fullWidth={true}
                               multiline={true}
                               margin="normal"
                               variant="outlined"/>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Language</InputLabel>
                        <Select disabled={false} value={lang}
                                onChange={getEventValue(KlassStore.updateLang)}>
                            {["Python", "Scala", "JavaScript", "Ruby", "C++"].map(langName =>
                                <MenuItem value={langName.toLowerCase()} key={langName}
                                          disabled={(langName !== "Python") &&
                                          true}
                                > {/*(langName !== "Scala")*/}
                                    {langName}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Visibility</InputLabel>
                        <Select
                            value={this.props.visibility}
                            onChange={getEventValue(KlassStore.updateVisibility)}>
                            >
                            <MenuItem value={"PUBLIC"}>Public</MenuItem>
                            <MenuItem value={"PRIVATE"}>Private</MenuItem>
                        </Select>

                    </FormControl>

                    {/*<TextField label={`Requirements`}*/}
                    {/*           value={reqs}*/}
                    {/*           disabled={true}*/}
                    {/*           onChange={getEventValue(KlassStore.updateReqs)}*/}
                    {/*           component={Ui.h1}*/}
                    {/*           fullWidth={true}*/}
                    {/*           multiline={true}*/}
                    {/*           margin="normal"*/}
                    {/*           variant="outlined"/>*/}

                    {/*FIXME: make this work even for the default image */}
                    {/*{(img && img.name) &&*/}
                    {/*<TextField disabled={true} label={"Container Image"}*/}
                    {/*           value={`${img.name}:${img.version}`}*/}
                    {/*           component={Ui.h1}*/}
                    {/*           fullWidth={true}*/}
                    {/*           margin="normal"*/}
                    {/*           variant="outlined"/>}*/}
                </form>

                <DialogActions>
                    <Button color="primary" onClick={this.onSave}>Save</Button>
                </DialogActions>

            </DialogContent>
        </Dialog>);
    }

    onSave = () => {
        /* Post a save-mutation and close. */
        KlassStore.saveKlass();
        AppUi.closeDialogs();
    };
}


KlassInfoDialog = withStyles(styles)(KlassInfoDialog);

export default Store.connect(state => {
    if (!state.klass) return {loaded: false};
    return {
        loaded: true,
        id: state.klass.id,
        title: state.klass.title,
        desc: state.klass.desc,
        runtime: state.klass.runtime,
        visibility: state.klass.visibility,
    }
})(KlassInfoDialog);

