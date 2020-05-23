import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import Fab from "@material-ui/core/Fab";
import CodeIcon from "@material-ui/icons/Code";
import Divider from "@material-ui/core/Divider";
import {withStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import GitHubCircleIcon from "mdi-material-ui/GithubCircle";

import GridLayout from "../../KlassLive/GridLayout";
import ProblemLayout from "../../KlassLive/ProblemLayout";
import RowLayout from "../../KlassLive/RowLayout";

import Api from "../../KlassLive/api";
import Store from "../../Store";
import * as UserStore from "../../Store/User";
import * as KlassStore from "../../Store/KlassStore";
import settings from "../../settings";
import Ui from "../../KlassLive/Ui";
import * as AppUi from "../../Store/AppUi";
import * as Session from "../../Store/sessions";
import * as auth from "../../auth";
import images from "./images";
import {BigList, klassItem, klassSessionItem} from "../../KlassLive/BigList";


const styles = (theme) => ({
    emptyStateIcon: {
        fontSize: theme.spacing(12)
    },
    button: {
        marginTop: theme.spacing(1)
    },
    buttonIcon: {
        marginRight: theme.spacing(1)
    }
});


const KlassList = props => {
    const {title, klasses, ifEmpty} = props;
    if (!klasses || !klasses.length) return null;

    return <ProblemLayout>
        <Ui.h1>{title}</Ui.h1>
        <BigList title={title} ifEmpty={ifEmpty}>
            {klasses.map((s, n) => klassItem(s, n))}
        </BigList>
    </ProblemLayout>;

    // return <ProblemLayout>
    //     <Ui.h1>Open Klass Sessions</Ui.h1>
    //     <BigList title={title} ifEmpty={ifEmpty}>
    //         {klass_sessions.map((s, n) => klassSessionItem(s, n))}
    //     </BigList>
    // </ProblemLayout>;
}

const KlassSessionList = props => {
    const {title, klass_sessions, ifEmpty} = props;
    if (!klass_sessions || !klass_sessions.length) return null;

    return <ProblemLayout>
        <Ui.h1>{title}</Ui.h1>
        <BigList title={title} ifEmpty={ifEmpty}>
            {klass_sessions.map((s, n) => klassSessionItem(s, n))}
        </BigList>
    </ProblemLayout>;

    //
    // const [first, ...rest] = klass_sessions;
    //
    // const item = s => {
    //     return <ListItem component="li" inset={"true"}>
    //         <Ui.Link to={`/session/${s.id}`}>
    //             {s.title}
    //         </Ui.Link>
    //     </ListItem>;
    // };
    //
    // return <ProblemLayout>
    //     <Ui.h1>{title}</Ui.h1>
    //     <List component={"div"} disablePadding>
    //         {item(first)}
    //         {rest.map((s, i) => {
    //             return <React.Fragment key={i}>
    //                 <Divider component="li"/>
    //                 {item(s)}
    //             </React.Fragment>;
    //         })}
    //     </List>
    // </ProblemLayout>;
};

export class HomeContent extends Component {
    state = {openSessions: null, pastSessions: null, upcomingSessions: null, klasses: null, redirectTo: null};

    componentDidMount = async () => {
        Session.reset();
        AppUi.disableDrawers();
        await this.getSessions();
        await this.getKlasses();
    };
    componentWillUnmount = () => {
        AppUi.enableDrawers();
    };

    getSessions = async () => {
        const {data, errors} = await Api.query({query: Api.GET_KLASS_SESSIONS_QUERY});
        if (errors) {
            AppUi.openSnackbar("Error Loading Open Sessions");
            return this.setState({openSessions: null, pastSessions: null, upcomingSessions: null});
        }
        const {klass_sessions} = data;
        const openSessions = klass_sessions.filter(k => k.session_state === "ACTIVE");
        const upcomingSessions = klass_sessions.filter(k => k.session_state === "FUTURE");
        const pastSessions = klass_sessions.filter(k => (k.session_state === "CLOSED" || k.session_state === "EXPIRED"));
        this.setState({openSessions, pastSessions, upcomingSessions});
    };
    getKlasses = async () => {
        const {data, errors} = await Api.query({query: Api.GET_KLASSES_QUERY});
        if (errors || !data || !data.klasses) {
            AppUi.openSnackbar("Error Loading Open Sessions");
            return this.setState({klasses: null});
        }
        const {klasses} = data;
        this.setState({klasses});
    };

    requestHostPermissions = async () => {
        let {user} = this.props;
        if (!user) user = await auth.signInWithProvider();
        if (!user) return AppUi.openSnackbar(`Sign In with GitHub to Get Started!`);

        const {data, errors} = await UserStore.requestHostPermissions();
        if (errors || !data || !data.permission_request || !data.permission_request.permissions) {
            return AppUi.openSnackbar(`Error Requesting Access. Please contact help@klass.live for help!`);
        }
        // Give some notice
        const {permissions} = data.permission_request;
        if (permissions.createKlass === "GRANTED" && permissions.hostSession === "GRANTED") {
            return AppUi.openSnackbar(`You're In! Get Started by Creating a New Klass or Hosting a Session!`);
        } else if (permissions.createKlass === "DENIED" || permissions.hostSession === "DENIED") {
            return AppUi.openSnackbar(`Sorry We Aren't Able to Offer Host Access at This Time.
            Contact help@klass.live with any questions.`);
        } else if (permissions.createKlass === "REQUESTED" || permissions.hostSession === "REQUESTED") {
            return AppUi.openSnackbar(`Request Received. Look out for a reply by email.`);
        }
    };
    createKlass = async () => {
        const {data, errors} = await KlassStore.createKlass();
        if (errors || !data || !data.createKlass || !data.createKlass.id) {
            return AppUi.openSnackbar("Klass Creation & Hosting are in Limited Beta. \n" +
                "Request Access or Contact help@klass.live.");
        }
        return this.setState({redirectTo: `klass/${data.createKlass.id}`});
    };

    render() {
        if (this.state.redirectTo) return <Redirect push to={this.state.redirectTo}/>;

        const {user, classes, useDarkTheme} = this.props;
        const {openSessions, upcomingSessions, pastSessions, klasses} = this.state;
        const theme = useDarkTheme ? "dark" : "light";
        const imgs = images[theme];
        const hasHostAccess = Boolean(user && user.permissions && user.permissions.hostSession === "GRANTED");

        return (<GridLayout>
            <ProblemLayout>
                <CodeIcon className={classes.emptyStateIcon} color="action"/>
                <Ui.h1>{settings.title}</Ui.h1>
                <Ui.h3>Live, Interactive, Notebook-Based Teaching & Learning</Ui.h3>
                {!user &&
                <Fab className={classes.button} onClick={auth.signInWithProvider} variant="extended">
                    <GitHubCircleIcon className={classes.buttonIcon}/>
                    Log In with GitHub
                </Fab>
                }
            </ProblemLayout>
            <ProblemLayout>
                <Ui.h1>Interactive Teaching & Learning</Ui.h1>
                <Ui.h3>Klass.Live sessions run in interactive Jupyter-style notebooks</Ui.h3>
                <RowLayout>
                    <img style={{"maxHeight": "400px", "maxWidth": "100%"}} src={imgs.problem} alt="problem"/>
                    <img style={{"maxHeight": "400px", "maxWidth": "100%"}} src={imgs.scoreboard} alt="scoreboard"/>
                </RowLayout>
                <Ui.h1>Live, Interactive, and <em>Fun</em></Ui.h1>
                <Ui.h3>It gets better: Klass.Live sessions are an interactive learning game.</Ui.h3>
                <Ui.h3>Participants win points for correct answers.
                    Hosts keep track of everyone's progress. </Ui.h3>
            </ProblemLayout>
            <ProblemLayout>
                <Ui.h1>Zero Install, Zero Setup, Ever</Ui.h1>
                <Ui.h3>Interactively teaching a new software concept or library has always been too hard.</Ui.h3>
                <Ui.h3>Stop doing this:</Ui.h3>
                <img style={{"maxHeight": "400px", "maxWidth": "100%"}} src={imgs.install} alt="install"/>
                <Ui.h3>And start teaching & learning. Right away.</Ui.h3>
                <Ui.h3>Klass.Live sessions never require installation, setup,
                    or any other impediment to getting started ASAP.</Ui.h3>

            </ProblemLayout>
            <ProblemLayout>
                <Ui.h1>All You Need is a URL</Ui.h1>
                <Ui.h3>Joining a Klass just requires its web address.</Ui.h3>
                <Ui.h3>Check out examples like
                    <Ui.Link to={"/pyconde"}> klass.live/pyconde</Ui.Link>
                </Ui.h3>
                <img style={{"maxHeight": "300px", "maxWidth": "100%"}} src={imgs.join} alt="join"/>
                {/*FIXME!*/}
                {/*<Ui.h3>Or try a demo session at*/}
                {/*    <a href={"https://klass.live/demo"}> klass.live/demo</a>*/}
                {/*</Ui.h3>*/}
            </ProblemLayout>
            <ProblemLayout>
                <Ui.h1>Nobody Left Behind</Ui.h1>
                <RowLayout>
                    <Ui.h3>Host-provided tests check and score everyone's code.</Ui.h3>
                    <img style={{"maxHeight": "400px", "maxWidth": "100%"}} src={imgs.review} alt="review"/>
                    <Ui.h3>Then hosts can review everyone's responses,
                        for a perfect insight into who's getting what.</Ui.h3>
                </RowLayout>
            </ProblemLayout>
            <ProblemLayout>
                <Ui.h1>Hosting </Ui.h1>
                <Ui.h3>Writing Klasses works just like writing Jupyter notebooks.</Ui.h3>
                <Ui.h3>Hosts can choose from an array of supported languages, <br/>
                    or create a custom environment for klass-time code execution.</Ui.h3>
                {!hasHostAccess ?
                    <Ui.h3>Klass.Live hosting is in limited beta. Request access and become a host!</Ui.h3> :
                    <Ui.h3>You're invited for Beta Access to be a Klass.Live host!</Ui.h3>
                }
                {!hasHostAccess ?
                    <Fab className={classes.button} onClick={this.requestHostPermissions}
                         color="secondary" variant="extended">
                        Become a Host
                    </Fab> :
                    <Fab className={classes.button} onClick={this.createKlass}
                         color="secondary" variant="extended">
                        Create A Klass
                    </Fab>}
            </ProblemLayout>

            <KlassSessionList title={"Open Klass Sessions"} klass_sessions={openSessions}/>
            <KlassSessionList title={"Upcoming Klass Sessions"} klass_sessions={upcomingSessions}/>
            <KlassSessionList title={"Recent Klass Sessions"} klass_sessions={pastSessions}/>
            <KlassList title={"Latest Klasses"} klasses={klasses}/>

        </GridLayout>);
    }
}

HomeContent = withStyles(styles)(HomeContent);

export default Store.connect(state => ({
    user: state.user,
    useDarkTheme: state.theme && state.theme.options.type === 'dark'
}))(HomeContent);

