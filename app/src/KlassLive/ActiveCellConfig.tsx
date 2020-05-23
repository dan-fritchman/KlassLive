import React from "react";
import {push} from "connected-react-router";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";

import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import Delete from "@material-ui/icons/Delete";
import LiveTv from "@material-ui/icons/LiveTv";
import CallSplit from "@material-ui/icons/CallSplit";
import Save from "@material-ui/icons/Save";
import Info from "@material-ui/icons/Info";

import Store from "../Store";
import * as KlassStore from "../Store/KlassStore";
import * as AppUi from "../Store/AppUi";


const addCell = () => Store.dispatch({type: "ADD_CELL"});
const deleteCell = () => Store.dispatch({type: "DELETE_CELL"});
const addProblem = () => Store.dispatch({type: "ADD_PROBLEM"});
const deleteProblem = () => Store.dispatch({type: "DELETE_ACTIVE_PROBLEM"});
const createSession = () => AppUi.openDialog("createKlassSession");
const openInfoDialog = () => AppUi.openDialog("klassInfo");

const updateCellType = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value = event.target.value as string;
    Store.dispatch({type: "UPDATE_ACTIVE_CELL_TYPE", cell_type: value});
};

interface Props {
    isActive: Boolean;
    isTypeEditable: Boolean;
    cellType: string;
    push: any;
}

export class ActiveCellConfig extends React.Component<Props> {

    forkKlass = async () => {
        const newKlass: any = await KlassStore.forkKlass();
        if (!newKlass.id) return AppUi.openSnackbar("Error Forking Klass");
        AppUi.openSnackbar("Created New Klass-Fork");
        this.props.push(`/klass/${newKlass.id}`);
    };

    render() {
        const {cellType, isActive} = this.props;

        return <React.Fragment>

            <Select disabled={!isActive} value={cellType}
                    onChange={updateCellType}>
                <MenuItem value="code">Code</MenuItem>
                <MenuItem value="markdown">Markdown</MenuItem>
            </Select>

            <Tooltip title={"Edit Klass Info"} enterDelay={300}>
                <IconButton onClick={openInfoDialog}>
                    <Info/>
                </IconButton>
            </Tooltip>

            <Tooltip title={"Add Cell"} enterDelay={300}>
                <IconButton onClick={addCell}>
                    <AddCircleOutline/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"Delete Cell"} enterDelay={300}>
                <IconButton onClick={deleteCell}>
                    <Delete/>
                </IconButton>
            </Tooltip>

            <Tooltip title={"Add Problem"} enterDelay={300}>
                <IconButton onClick={addProblem}>
                    <AddCircleOutline/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"Delete Problem"} enterDelay={300}>
                <IconButton onClick={deleteProblem}>
                    <Delete/>
                </IconButton>
            </Tooltip>

            <Tooltip title={"Save"} enterDelay={300}>
                <IconButton onClick={KlassStore.saveKlass}>
                    <Save/>
                </IconButton>
            </Tooltip>

            <Tooltip title={"Fork This Klass"} enterDelay={300}>
                <IconButton onClick={this.forkKlass as any}>
                    <CallSplit/>
                </IconButton>
            </Tooltip>

            <Tooltip title={"Start Session"} enterDelay={300}>
                <IconButton onClick={createSession}>
                    <LiveTv/>
                </IconButton>
            </Tooltip>

        </React.Fragment>;
    }
}

export default Store.connect(
    (state: any) => {
        const {klass} = state;
        if (!klass) {
            return {cellType: "code", isActive: false, isTypeEditable: false, klass_id: null};
        }
        const activeCell = klass.cellsById[klass.activeCellId];
        if (!activeCell) {
            return {cellType: "code", isActive: false, isTypeEditable: false, klass_id: klass.id};
        }
        return {cellType: activeCell.cell_type, isActive: true, isTypeEditable: true, klass_id: klass.id};
    }, {push})(ActiveCellConfig);

