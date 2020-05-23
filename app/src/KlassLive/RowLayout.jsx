import React from "react";
import Grid from "@material-ui/core/Grid";


export default function RowLayout(props) {
    const {children} = props;
    return <Grid container direction={"row"} alignItems="center" spacing={2} width="100%">
        {React.Children.map(children, (child, idx) =>
            <Grid item zeroMinWidth index={idx}>
                {child}
            </Grid>
        )}
    </Grid>
}
