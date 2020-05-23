import Octokit from "@octokit/rest";

import {auth, githubProvider} from "./firebase";
import Api from "./KlassLive/api";
import Store from "./Store";
import * as AppUi from "./Store/AppUi";
import * as Sessions from "./Store/sessions";


let refreshIntervalId = null;
let authObserver = null;

const getIdToken = () => {
    /* Get a new FireBase ID token.
     * This will be used to authenticate all our GraphQL activity. */
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken(true); // Force refresh = true
};

const authCb = async user => {
    if (user) {  // Run the user-object through our prep-steps
        const preppedUser = await _prepUser(user);
        if (!preppedUser) Store.dispatch({type: "USER_LOGOUT"});
    } else {
        Store.dispatch({type: "USER_LOGOUT"});
    }
    await Sessions.resetUser();
    await AppUi.update({isAuthReady: true});
};

export const mount = async () => {
    /* App-Mount-Time Auth Setup */
    // Set up auth-change observer
    authObserver = auth.onAuthStateChanged(authCb);
    // Set up token refreshing
    const refreshPeriod = 5 * 60 * 1000; // 5 minutes
    refreshIntervalId = setInterval(refreshUser, refreshPeriod);
};

export const unmount = async () => {
    /* App-UnMount-Time Auth Setup */
    if (refreshIntervalId) clearInterval(refreshIntervalId);
    if (authObserver) authObserver();
};

export const refreshUser = async () => {
    /* Get a new ID Token */
    const state = Store.getState();
    let {user} = state;
    if (!(user && auth.currentUser)) return;
    const idToken = await getIdToken();
    if (!idToken) return;
    Store.dispatch({type: "USER_UPDATE", user: {...user, idToken}});
};

const _prepUser = async (user) => {
    /* Do some more stuff to get `user` ready for local storage. */
    const idToken = await getIdToken();
    if (!idToken) {
        AppUi.openSnackbar("Error Generating ID Token");
        return Store.dispatch({type: "USER_LOGOUT"});
    }
    user.idToken = idToken;
    Store.dispatch({type: "USER_LOGIN", user});

    // Post an update to UserInfo in our DB, and grab any extra info from there
    const userUpdates = await Api.updateUser(user);
    Store.dispatch({type: "USER_UPDATE", user: userUpdates});
    return userUpdates;
};

const _signIn = async () => {
    /* Internal exception-throwing sign-in helper */

    // Authenticate via the FireBase API
    let {user, credential} = await auth.signInWithPopup(githubProvider);
    if (!user || !credential) throw new Error(`Could Not Log In`);

    // Get remaining info from GitHub API
    if (!credential) {
        AppUi.openSnackbar(`Could Not Connect to GitHub Account`);
        return Store.dispatch({type: "USER_LOGOUT"});
    }
    const octokit = Octokit({auth: credential.accessToken});
    const {data} = await octokit.users.getAuthenticated();
    if (!data) {
        AppUi.openSnackbar(`Could Not Connect to GitHub Account`);
        return Store.dispatch({type: "USER_LOGOUT"});
    }
    let githubUser = {
        // Mostly keep the stuff from GitHub
        ...data,
        // Rename a few fields
        photoURL: data.avatar_url,
        displayName: data.name || data.login,
        email: data.email || user.email,
        // And keep these from FireBase
        uid: user.uid,
        metadata: user.metadata,
    };
    return await _prepUser(githubUser);
};

export const signInWithProvider = async () => {
    const state = Store.getState();
    if (state.user) return state.user;

    AppUi.update({isPerformingAuthAction: true});

    let user = null;
    try {
        user = await _signIn();
        AppUi.closeDialogs();
        AppUi.openSnackbar(`Signed in as ${user.displayName || user.email}`);
    } catch (reason) {
        Store.dispatch({type: "USER_LOGOUT"});
        const code = reason.code;
        const message = reason.message;

        switch (code) {
            case "auth/account-exists-with-different-credential":
            case "auth/auth-domain-config-required":
            case "auth/cancelled-popup-request":
            case "auth/operation-not-allowed":
            case "auth/operation-not-supported-in-this-environment":
            case "auth/popup-blocked":
            case "auth/popup-closed-by-user":
            case "auth/unauthorized-domain":
            default:
                AppUi.openSnackbar(message);
        }
    } finally {
        AppUi.update({isPerformingAuthAction: false});
    }
    return user;
};

export const signOut = async () => {
    const state = Store.getState();
    if (!state.user) return null;

    AppUi.update({isPerformingAuthAction: true});

    try {
        await auth.signOut();
        await AppUi.openSnackbar("Signed out");
        await AppUi.closeDialogs();

    } catch (reason) {
        const code = reason.code;
        const message = reason.message;
        AppUi.openSnackbar(message);

    } finally {
        Store.dispatch({type: "USER_LOGOUT"});
        AppUi.update({isPerformingAuthAction: false});
    }
    return null;
};

