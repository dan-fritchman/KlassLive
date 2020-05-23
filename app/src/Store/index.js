/* ******************************
 * Top-Level Redux Store Setup
 * ****************************** */

import React from "react";

import {Provider, connect} from "react-redux";
import {combineReducers, createStore, applyMiddleware, compose} from "redux";
import {createBrowserHistory} from "history";
import {connectRouter, routerMiddleware} from "connected-react-router";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import ReactGA from 'react-ga';

import {themeReducer} from "./Theme";
import {userReducer} from "./User";
import {klassReducer} from "./KlassStore";
import {uiReducer} from "./AppUi";
import {userSessionReducer, klassSessionReducer} from "./sessions";


// Set up analytics
let logPageView = page => console.log(`Loading ${page}`);
const {NODE_ENV, REACT_APP_ANALYTICS_ID} = process.env;
if (NODE_ENV === "production") {
    if (REACT_APP_ANALYTICS_ID) {
        ReactGA.initialize(REACT_APP_ANALYTICS_ID);
        logPageView = page => ReactGA.pageview(page);
    } else {
        console.error(`No Analytics ID Available`);
    }
}

const trackingMiddleware = store => next => action => {
    if (logPageView && action.type === '@@router/LOCATION_CHANGE') {
        const {location} = action.payload;
        const nextPage = `${location.pathname}${location.search}`;
        // ReactGA.set({page, ...options,});
        logPageView(nextPage);
    }
    return next(action);
};

export const history = createBrowserHistory();
const routeMiddleware = routerMiddleware(history);
const routerReducer = connectRouter(history);
const middlewares = [routeMiddleware, trackingMiddleware];

// Add Redux devtools
let composeEnhancers = compose;
if (typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    });
}

const allReducers = combineReducers({
    user: userReducer,
    klass: klassReducer,
    klass_session: klassSessionReducer,
    user_session: userSessionReducer,
    ui: uiReducer,
    theme: themeReducer,
    router: routerReducer
});

const baseReducer = (state, action) => {
    if (action.type === "RESET_APP") state = undefined;
    return allReducers(state, action);
};


const persistConfig = {
    key: "hw21::root",
    storage: storage,
    whitelist: ["user"]
};

const store = createStore(
    persistReducer(persistConfig, baseReducer),
    undefined,
    composeEnhancers(applyMiddleware(...middlewares))
);

const persistor = persistStore(store);

const KlassStoreProvider = props => {
    return <Provider store={store}>
        {props.children}
    </Provider>;
};

export const Store = {
    connect,
    store,
    persistor,
    dispatch: store.dispatch,
    getState: store.getState,
    Provider: KlassStoreProvider,
    connectProblem: Comp => {
        return connect(
            (state, myProps) => {
                if (!state.klass) return {prob: null};

                return {
                    loaded: true,
                    prob: state.klass.problemsById[myProps.id],
                    isActive: myProps.id === state.klass.activeProblemId,
                };
            })(Comp);
    },
    connectUser: Comp => connect(state => ({user: state.user}))(Comp),
};

export default Store;

