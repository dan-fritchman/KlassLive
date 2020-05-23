import React from "react";
import Drawer from "@material-ui/core/Drawer";
import * as Scroll from "react-scroll/modules";
import Hidden from "@material-ui/core/Hidden";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Box from '@material-ui/core/Box';
import withStyles from "@material-ui/core/styles/withStyles";

import Ui from "../KlassLive/Ui";
import Store from "../Store";
import {toCapWords} from "../utils";
import Scoreboard from "../KlassLive/Scoreboard";


const drawerWidth = 240;

const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    toolbar: theme.mixins.toolbar
});

class KlassContents extends React.Component {
    /* Klass Table of Contents */
    render() {
        if (!this.props.loaded) return null;

        const {/*classes, klassTitle, */problemTitles, problem_num} = this.props;
        // const renderKlassTitle = klassTitle || "Klass";
        return <React.Fragment>
            {/*<Stepper activeStep={0}>*/}
            {/*    <Step key={null}>*/}
            {/*        <StepLabel>*/}
            {/*            <Scroll.Link to={"1"} offset={-100} smooth={true} duration={500}>*/}
            {/*                <h2>{renderKlassTitle}</h2>*/}
            {/*            </Scroll.Link>*/}
            {/*        </StepLabel>*/}
            {/*    </Step>*/}
            {/*</Stepper>*/}

            <Stepper activeStep={problem_num} orientation="vertical">
                {problemTitles.map((title, n) => {
                    const completed = problem_num > n;
                    const disabled = n > problem_num;
                    let renderTitle = title || "Problem " + toCapWords(n + 1);
                    if (completed) renderTitle = `${n + 1}. ` + renderTitle;
                    return <Step completed={completed} disabled={disabled} key={n}>
                        <StepLabel>
                            <Scroll.Link to={`${n}`} offset={-100} smooth={true} duration={500}>
                                {renderTitle}
                            </Scroll.Link>
                        </StepLabel>
                    </Step>;
                })}
            </Stepper>
        </React.Fragment>;
    }
}

KlassContents = Store.connect(state => {
    if (!state.klass) return {loaded: false};
    let problem_num = 0;
    // FIXME: problem-number for klass editing
    if (state.klass_session) problem_num = state.klass_session.problem_num;
    return {
        loaded: true,
        klassTitle: state.klass.title,
        problemTitles: state.klass.problemIds.map(id => (
            state.klass.problemsById[id].title
        )),
        problem_num,
    }
})(KlassContents);

class LeftDrawer extends React.Component {
    render() {
        const {classes, enabled} = this.props;
        return (<React.Fragment>
            {enabled && <React.Fragment>
                <Hidden mdDown>
                    <Drawer variant="permanent"
                        // className={classes.drawer}
                            classes={{paper: classes.drawerPaper}}
                    > {/* This little trick places AppBar over side ToolBar */}
                        <div className={classes.toolbar}/>

                        <Box style={{flexGrow: 1}}>
                            {/* Table of Contents */}
                            <KlassContents/>
                        </Box>
                        <Box p={4}>
                            <Ui.Link color={"textSecondary"} variant={"h6"} href={"mailto:dan@klass.live"}>
                                Problems? Email CEO
                            </Ui.Link>
                        </Box>

                    </Drawer>
                </Hidden>
                <Hidden mdDown>
                    <Drawer variant="permanent"
                            anchor="right"
                        // className={classes.drawer}
                            classes={{paper: classes.drawerPaper}}>
                        {/* This little trick places AppBar over side ToolBar */}
                        <div className={classes.toolbar}/>
                        <Scoreboard/>
                    </Drawer>
                </Hidden>
            </React.Fragment>}
        </React.Fragment>);
    }
}

LeftDrawer = withStyles(styles)(LeftDrawer);
export default Store.connect(state => ({enabled: state.ui.drawers.enabled}))(LeftDrawer);
