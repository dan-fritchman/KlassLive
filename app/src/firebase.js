/*
 * Load up Firebase Settings, start up required services
 * Importing this module generally needs to run "first",
 * or at least before using any of this stuff.
 */

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/performance";

import settings from "./settings";


firebase.initializeApp(settings.credentials.firebase);
const auth = firebase.auth();

// eslint-disable-next-line no-unused-vars
const performance = firebase.performance();

auth.useDeviceLanguage();

const githubProvider = new firebase.auth.GithubAuthProvider().addScope("read:user");

export {
  firebase,
  auth,
  githubProvider
};

