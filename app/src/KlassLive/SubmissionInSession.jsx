import Store from "../Store";
import Submission from "./Submission";

export default Store.connect((state, myProps) => ({
    submission: state.user_session.submissions[myProps.problemNum]
}))(Submission);

