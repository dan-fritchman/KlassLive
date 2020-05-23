import Api from "../KlassLive/api";
import * as AppUi from "./AppUi";
import Store from "./index";

export function userReducer(state = null, action) {
    switch (action.type) {
        case "USER_LOGIN":
            return action.user;
        case "USER_LOGOUT":
            return null;
        case "USER_UPDATE":
            // Update the existing user data.
            // Only applies if `action.user.uid` matches the logged-in UID.
            if (!state.uid || !action.user || !action.user.uid || state.uid !== action.user.uid) {
                return state;
            }
            return {...state, ...action.user};
        default:
            return state;
    }
}

export const requestHostPermissions = async () => {
    /* Post an API "permissions request" mutation.
     * Return what comes back from API.  */
    const {data, errors} = await Api.mutate({
        mutation: Api.PERMISSION_REQUEST_MUTATION,
        variables: {permissionTypes: ["createKlass", "hostSession"]},
    });
    if (!errors && data && data.permission_request) {
        const userUpdates = data.permission_request;
        Store.dispatch({type: "USER_UPDATE", user: userUpdates});
    }
    return {data, errors};
};

