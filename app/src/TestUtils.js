import firebase from "firebase/app";
import "firebase/auth";
import * as admin from "firebase-admin";

import settings from "./settings";
const serviceAccount = require("../../api/serviceAccountKey.json");

import Api from "./KlassLive/api";


export const initFirebase = async () => {
    // Initialize client side stuff
    firebase.initializeApp(
        settings.credentials.firebase
    );
    // Initialize admin/ server side stuff
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.REACT_APP_DATABASE_URL
    });
};

export const getMockUser = async (uid) => {
    if (!uid) throw new Error("Missing Required `uid` for `getMockUser`");

    // Create a custom admin token
    const adminAuth = admin.auth();
    const customToken = await adminAuth.createCustomToken(uid);
    // Send token back to client
    const user = await firebase.auth().signInWithCustomToken(customToken);
    const userToken = await firebase.auth().currentUser.getIdToken(true);
    const context = Api.getContext(userToken);

    const {displayName, photoURL} = user;
    const userData = {uid, displayName, photoURL};

    return {context, userData};
};

