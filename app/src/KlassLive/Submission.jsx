import React from "react";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Error from "@material-ui/icons/Error";
import CheckCircle from "@material-ui/icons/CheckCircle";
import {withStyles} from "@material-ui/core";

import Ui from "./Ui";
import Store from "../Store";
import RowLayout from "./RowLayout";


const styles = theme => ({
    cellOutput: {
        maxHeight: "50vh",
        overflow: "scroll",
    },
});

export class Submission extends React.Component {
    /* Render a Submission Output, Errors, and Score */
    render() {
        const {submission, classes} = this.props;
        if (!submission) return null;

        if (submission.state === "IN_PROGRESS") {
            return <RowLayout>
                <CircularProgress size={29}/>
                <Ui.h3>Score: Pending</Ui.h3>
            </RowLayout>;
        }

        const {output, errs, score} = submission;
        const passFail = Boolean(score > 0); // FIXME: customize

        return <Box>
            <RowLayout>
                {passFail ?
                    <CheckCircle fontSize={"large"}/> :
                    <Error fontSize={"large"} color="error"/>
                }
                <Ui.h3>Score: {submission.score}</Ui.h3>
            </RowLayout>

            <Box className={classes.cellOutput}>
                {errs && <Box color="error.main">
                    {errs.split("\n").map((line, idx) =>
                        <pre key={idx}>
                        <code>{line}</code>
                    </pre>)}
                </Box>}
                {output && <Box>
                    {output.split("\n").map((line, idx) =>
                        <pre key={idx}>
                        <code>{line}</code>
                    </pre>)}
                </Box>}
            </Box>
        </Box>;
    }
}

export default withStyles(styles)(Submission);
