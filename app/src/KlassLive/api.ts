import ApolloClient, {gql} from "apollo-boost";
import Store from "../Store";

import {CreateKlassSession, JoinKlassSession} from "../../types/globalTypes";


const createClient = () => {
    /* Load client details from env, and create a client
     * Would be great if dotenv did some of this stuff. */

    const {
        REACT_APP_KLASSLIVE_GRAPHQL_URI,
        REACT_APP_KLASSLIVE_GRAPHQL_HOST,
        REACT_APP_KLASSLIVE_GRAPHQL_PORT
    } = process.env;

    if (!(REACT_APP_KLASSLIVE_GRAPHQL_URI &&
        REACT_APP_KLASSLIVE_GRAPHQL_HOST &&
        REACT_APP_KLASSLIVE_GRAPHQL_PORT)) {
        throw new Error("GraphQL URI Not Defined");
    }

    const graphqlUri = (REACT_APP_KLASSLIVE_GRAPHQL_URI as string)
        .replace("${REACT_APP_KLASSLIVE_GRAPHQL_HOST}", (REACT_APP_KLASSLIVE_GRAPHQL_HOST as string))
        .replace("${REACT_APP_KLASSLIVE_GRAPHQL_PORT}", (REACT_APP_KLASSLIVE_GRAPHQL_PORT as string));

    return new ApolloClient({uri: graphqlUri});
};

const client = createClient();

const getContext = (idToken: string | null) => {
    if (!idToken) {
        const {user} = Store.getState();
        if (!(user && user.idToken)) return undefined;
        idToken = user.idToken
    }
    return {headers: {authorization: `Bearer ${idToken}`}};
};

async function query(options: any): Promise<any> {
    /* Add regular options to our GraphQL client queries */
    try {
        return await client.query({
            fetchPolicy: "network-only", // No Cached Data Allowed!
            context: getContext(null),
            ...options,
        });
    } catch (e) {
        return {data: null, errors: e};
    }
}

async function mutate(options: any): Promise<any> {
    /* Add regular options to our GraphQL client queries */
    try {
        return await client.mutate({
            context: getContext(null),
            ...options,
        });
    } catch (e) {
        return {data: null, errors: e};
    }
}

class Api {
    /* GraphQL Api Client */

    client = client;
    mutate = mutate;
    query = query;
    getContext = getContext;

    HEALTH_QUERY = gql`query HealthQuery { health }`;
    CANARY_QUERY = gql`query CanaryQuery { canary }`;

    USER_INFO_FRAGMENT = gql`
        fragment UserInfo on User {
            uid
            displayName
            email
            photoURL
        }`;

    USER_SESSIONS_FRAGMENT = gql`
        fragment UserSessionsFragment on User {
            sessions {
                id
                klass_session {
                    id
                    title
                    session_state
                    problem_num
                    host { ...UserInfo }
                }
                scores {
                    problems
                    total
                }
            }
        }`;

    USER_KLASSES_FRAGMENT = gql`
        fragment UserKlassesFragment on User {
            klasses {
                id
                title
                desc
                owner { ...UserInfo }
            }
        }
    ${this.USER_INFO_FRAGMENT}`;

    USER_DETAIL_FRAGMENT = gql`
        fragment UserDetailFragment on User {
            ...UserInfo
            ...UserKlassesFragment
            ...UserSessionsFragment
            permissions
        }
        ${this.USER_INFO_FRAGMENT}
        ${this.USER_SESSIONS_FRAGMENT}
    ${this.USER_KLASSES_FRAGMENT}`;

    USER_DETAIL_QUERY = gql`
        query UserDetail($id: String) {
            user(id: $id) {
                ...UserDetailFragment
            }
        }
    ${this.USER_DETAIL_FRAGMENT}`;

    GET_USER_INFO_QUERY = gql`
        query GetUser($id: String) {
            user(id: $id) {
                ...UserInfo
                ...UserSessionsFragment
            }
        }
        ${this.USER_INFO_FRAGMENT}
    ${this.USER_SESSIONS_FRAGMENT}`;

    UPDATE_USER_MUTATION = gql`
        mutation UpdateUser($data: UpdateUser) {
            updateUser(data: $data) {
                ...UserDetailFragment
            }
        }
    ${this.USER_DETAIL_FRAGMENT}`;

    PERMISSION_REQUEST_MUTATION = gql`
        mutation PermissionRequest($permissionTypes: [String]) {
            permission_request(permissionTypes: $permissionTypes) {
                ...UserDetailFragment
            }
        }
    ${this.USER_DETAIL_FRAGMENT}`;

    updateUser = async (user: any) => {
        const {uid, displayName, email, photoURL} = user;
        const data = {uid, displayName, email, photoURL};
        const json = await mutate({
            mutation: this.UPDATE_USER_MUTATION,
            variables: {data}
        });
        if (json.errors) {
            console.error(json.errors);
            return {};
        }
        return json.data.updateUser;
    };

    SUBMISSION_DATA_FRAGMENT = gql`
        fragment SubmissionData on Submission {
            id
            klass_id
            user_session_id
            klass_session_id
            problem_num
            state
            score
            source
            output
            errs
        }`;

    CELL_DATA_FRAGMENT = gql`
        fragment CellData on Cell {
            cell_type
            execution_count
            source
            metadata
            submission {
                ...SubmissionData
            }
        }
    ${this.SUBMISSION_DATA_FRAGMENT}`;

    KLASS_INFO_FRAGMENT = gql`
        fragment KlassInfoFragment on KlassFolded {
            id
            title
            desc
            owner { ...UserInfo }
            runtime
            visibility
        }
    ${this.USER_INFO_FRAGMENT}`;

    KLASS_CONTENT_FRAGMENT = gql`
        fragment KlassContentFragment on KlassFolded {
            problems {
                title
                desc
                setup { ...CellData }
                prompt { ...CellData }
                solution { ...CellData }
                tests { ...CellData }
            }
            scratch { ...CellData }
        }
    ${this.CELL_DATA_FRAGMENT}`;

    KLASS_DATA_FRAGMENT = gql`
        fragment KlassDataFragment on KlassFolded {
            ...KlassInfoFragment
            ...KlassContentFragment
        }
        ${this.KLASS_INFO_FRAGMENT}
    ${this.KLASS_CONTENT_FRAGMENT}`;

    GET_KLASS_FOLDED_QUERY = gql`
        query GetKlassFolded($id: String) {
            klass_folded(id: $id) {
                ...KlassDataFragment
            }
        }
    ${this.KLASS_DATA_FRAGMENT}`;

    getKlassFolded = async (id: string) => {
        return await query({
            query: this.GET_KLASS_FOLDED_QUERY,
            variables: {id}
        });
    };

    CREATE_KLASS_MUTATION = gql`
        mutation CreateKlassMutation {
            createKlass { ...KlassDataFragment }
        }
    ${this.KLASS_DATA_FRAGMENT}`;

    GET_KLASS_QUERY = gql`
        query GetKlass($id: String) {
            klass(id: $id) {
                nbformat
                nbformat_minor
                cells
                metadata
            }
        }`;

    UPDATE_KLASS_MUTATION = gql`
        mutation UpdateKlass($klass: KlassNotebookInput) {
            updateKlass(klass: $klass)
        }`;

    SUBMISSION_QUERY = gql`
        query Submission($id: String) {
            submission(id: $id) {
                ...SubmissionData
            }
        }
    ${this.SUBMISSION_DATA_FRAGMENT}`;

    querySubmission = async (id: number) => {
        const json = await query({
            query: this.SUBMISSION_QUERY,
            variables: {id}
        });
        if (json.errors) {
            console.error(json.errors);
            return {};
        }
        return json.data.submission;
    };

    SUBMIT_PROBLEM_MUTATION = gql`
        mutation SubmitProblemMutation($data: ProblemSubmission) {
            submission(data: $data) {
                ...SubmissionData
            }
        }
    ${this.SUBMISSION_DATA_FRAGMENT}`;

    SUBMIT_SOLUTION_MUTATION = gql`
        mutation SubmitSolutionMutation($klass: KlassFoldedInput, $problem_num:Int) {
            check_solution(klass: $klass, problem_num: $problem_num) {
                ...SubmissionData
            }
        }
    ${this.SUBMISSION_DATA_FRAGMENT}`;

    SUBMIT_PROMPT_MUTATION = gql`
        mutation SubmitPromptMutation($klass: KlassFoldedInput, $problem_num:Int) {
            check_prompt(klass: $klass, problem_num: $problem_num) {
                ...SubmissionData
            }
        }
    ${this.SUBMISSION_DATA_FRAGMENT}`;

    KLASS_SESSION_INFO_FRAGMENT = gql`
        fragment KlassSessionInfo on KlassSession {
            id
            title
            host { ...UserInfo }
            visibility
        }
    ${this.USER_INFO_FRAGMENT}`;

    KLASS_SESSION_STATE_FRAGMENT = gql`
        fragment KlassSessionState on KlassSession {
            session_state
            problem_num
            user_sessions {
                id
                user { ...UserInfo }
                scores {
                    problems
                    total
                }
            }
        }
    ${this.USER_INFO_FRAGMENT}`;

    KLASS_SESSION_DETAIL_FRAGMENT = gql`
        fragment KlassSessionDetail on KlassSession {
            ...KlassSessionInfo
            session_state
            setup_state
            payment_state
            problem_num
            user_sessions {
                id
                user { ...UserInfo }
                scores {
                    problems
                    total
                }
                responses { ...SubmissionData }
            }
        }
        ${this.KLASS_SESSION_INFO_FRAGMENT}
        ${this.USER_INFO_FRAGMENT}
    ${this.SUBMISSION_DATA_FRAGMENT}`;

    KLASS_SESSION_STATE_QUERY = gql`
        query GetKlassSession($id: String) {
            klass_session(id: $id) {
                ...KlassSessionInfo
                ...KlassSessionState
            }
        }
        ${this.KLASS_SESSION_INFO_FRAGMENT}
    ${this.KLASS_SESSION_STATE_FRAGMENT}`;

    KLASS_SESSION_DETAIL_QUERY = gql`
        query GetKlassSession($id: String) {
            klass_session(id: $id) {
                ...KlassSessionInfo
                ...KlassSessionDetail
            }
        }
        ${this.KLASS_SESSION_INFO_FRAGMENT}
    ${this.KLASS_SESSION_DETAIL_FRAGMENT}`;

    GET_KLASSES_QUERY = gql`
        query GetKlasses {
            klasses {
                ...KlassInfoFragment
            }
        }
    ${this.KLASS_INFO_FRAGMENT}`;

    GET_KLASS_SESSIONS_QUERY = gql`
        query GetKlassSessions {
            klass_sessions {
                ...KlassSessionInfo
                ...KlassSessionState
            }
        }
        ${this.KLASS_SESSION_INFO_FRAGMENT}
    ${this.KLASS_SESSION_STATE_FRAGMENT}`;

    UPDATE_KLASS_SESSION_MUTATION = gql`
        mutation UpdateKlassSessionInfoMutation ($data: UpdateKlassSessionInfo) {
            updateKlassSessionInfo(data: $data) {
                ...KlassSessionDetail
            }
        }
    ${this.KLASS_SESSION_DETAIL_FRAGMENT}`;

    UPDATE_KLASS_SESSION_STATE_MUTATION = gql`
        mutation UpdateKlassSessionState($klass_session_id: String, $state: KlassSessionState) {
            updateKlassSessionState(klass_session_id:$klass_session_id, state:$state) {
                ...KlassSessionDetail
            }
        }
    ${this.KLASS_SESSION_DETAIL_FRAGMENT}`;

    CREATE_KLASS_SESSION_MUTATION = gql`
        mutation CreateKlassSessionMutation($data: CreateKlassSession) {
            createKlassSession(data: $data) {
                ...KlassSessionInfo
                ...KlassSessionDetail
            }
        }
        ${this.KLASS_SESSION_INFO_FRAGMENT}
    ${this.KLASS_SESSION_DETAIL_FRAGMENT}`;

    createKlassSession = async (session: CreateKlassSession) => {
        /* Create a new Session with parameters `session`. */
        const json = await mutate({
            mutation: this.CREATE_KLASS_SESSION_MUTATION,
            variables: {
                data: session
            }
        });
        if (json.errors) {
            console.error(json.errors);
            return null;
        }
        return json.data.createKlassSession;
    };

    NEXT_PROBLEM_MUTATION = gql`
        mutation NextProblemMutation($id: String) {
            nextProblem(id: $id) {
                ...KlassSessionDetail
            }
        }
    ${this.KLASS_SESSION_DETAIL_FRAGMENT}`;

    nextProblem = async (id: number) => {
        const json = await mutate({
            mutation: this.NEXT_PROBLEM_MUTATION,
            variables: {id}
        });
        if (json.errors) {
            console.error(json.errors);
            return {};
        }
        return json.data.klass_session;
    };

    UPDATE_PROBLEM_NUMBER_MUTATION = gql`
        mutation UpdateProblemNumberMutation($id: String, $num:Int) {
            updateProblemNumber(id: $id, num: $num) {
                ...KlassSessionDetail
            }
        }
    ${this.KLASS_SESSION_DETAIL_FRAGMENT}`;

    updateProblemNum = async (id: string, num: number) => {
        const vars = {id, num};
        const json = await mutate({
            mutation: this.UPDATE_PROBLEM_NUMBER_MUTATION,
            variables: vars
        });
        if (json.errors) {
            console.error(json.errors);
            return {};
        }
        return json.data.updateProblemNumber;
    };

    USER_SESSION_FRAGMENT = gql`
        fragment UserSessionFragment on UserSession {
            id
            state
            user { ...UserInfo }
            responses { ...SubmissionData }
            klass_session {
                ...KlassSessionInfo
                ...KlassSessionState
                klass { ...KlassDataFragment }
            }
        }
        ${this.USER_INFO_FRAGMENT}
        ${this.SUBMISSION_DATA_FRAGMENT}
        ${this.KLASS_DATA_FRAGMENT}
        ${this.KLASS_SESSION_INFO_FRAGMENT}
    ${this.KLASS_SESSION_STATE_FRAGMENT}`;

    GET_USER_SESSION_QUERY = gql`
        query GetUserSession($id: String) {
            user_session(id: $id) {
                ...UserSessionFragment
            }
        }
    ${this.USER_SESSION_FRAGMENT}`;

    getUserSession = async (id: string) => {
        return await query({
            query: this.GET_USER_SESSION_QUERY,
            variables: {id}
        });
    };

    CREATE_USER_SESSION_MUTATION = gql`
        mutation JoinKlassSessionMutation($data: JoinKlassSession) {
            joinKlassSession(data: $data) {
                ...UserSessionFragment
            }
        }
    ${this.USER_SESSION_FRAGMENT}`;

    joinKlassSession = async (data: JoinKlassSession) => {
        /* Create a new Session with parameters `session`. */
        return await mutate({
            mutation: this.CREATE_USER_SESSION_MUTATION,
            variables: {data}
        });
    };

    FORK_KLASS_MUTATION = gql`
        mutation GetKlassFolded($klass_id: String) {
            forkKlass(klass_id: $klass_id) { ...KlassDataFragment }
        }
    ${this.KLASS_DATA_FRAGMENT}`;

    SAVE_KLASS_MUTATION = gql`
        mutation SaveKlassFolded($klass: KlassFoldedInput) {
            saveKlass(klass: $klass)
        }`;

    PAYMENT_AMOUNT_QUERY = gql`
        query PaymentAmount($for_type: PayForType, $id: String) {
            payment_amount(id: $id, for_type:$for_type)
        }`;

    PAYMENT_TOKEN_MUTATION = gql`
        mutation PaymentToken($for_type: PayForType, $id: String, $token:String) {
            payment_token(for_type: $for_type, id: $id, token: $token)
        }`;

    KLASS_SETUP_CHECK_QUERY = gql`
        query KlassSetupCheck($id: String) {
            klass_setup_check(id: $id) {
                id
                state
                build
                prompts {
                    klass_id
                    problem_num
                    state
                    score
                    source
                    output
                    errs
                }
                solutions {
                    klass_id
                    problem_num
                    state
                    score
                    source
                    output
                    errs
                }
            }
        }`;
}

// Singleton Api Instance
export default new Api();

