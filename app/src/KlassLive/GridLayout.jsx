import React, {Component} from "react";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core";


const styles = theme => ({
    gridLayout: {
        width: "100%",
        maxWidth: theme.breakpoints.values["md"],
    }
});

class GridLayout extends Component {
    /* Formats our MUI Grid */

    render() {
        const {children, classes} = this.props;
        return (<Container maxWidth="md">
            <Grid
                container
                className={classes.gridLayout}
                direction="column"
                justify="center"
                // alignContent="flex-start"
                alignItems="stretch"
                spacing={1}
                width="100%"
            >
                {React.Children.map(children, (child, index) => {
                    return <Grid item className={classes.gridLayout} zeroMinWidth width={"100%"} key={index}>
                        {child}
                    </Grid>;
                })}
            </Grid></Container>);
    }
}

export default withStyles(styles)(GridLayout);
