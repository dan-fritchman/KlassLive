import React from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";


const styles = theme => ({
    container: {
        // display: 'flex',
        // flexWrap: 'wrap',
        backgroundColor: theme.palette.background.paper
    },
    gridItem: {
        width: "100%",
    }
});

class ProblemLayout extends React.Component {
    /* Style a Problem into MUI grid */
    render() {
        const {children, classes, borderOptions} = this.props;
        if (!React.Children.count(children)) return null;

        return <Box width="100%" mt={1} mb={0} p={4} color="primary.main"
                    className={classes.container}
                    borderRadius={16}
                    {...borderOptions}>
            <Grid
                container
                direction="column"
                justify="flex-start"
                // alignContent="flex-start"
                alignItems="stretch"
                spacing={2}
                width="100%"
            >
                {React.Children.map(children, (child, index) => {
                    return <Grid item className={classes.gridItem} zeroMinWidth key={index}>
                        {child}
                    </Grid>;
                })}
            </Grid>
        </Box>;
    }
}

export default withStyles(styles)(ProblemLayout);
