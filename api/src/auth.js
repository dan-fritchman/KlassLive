import * as admin from "firebase-admin";

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.REACT_APP_DATABASE_URL
});

const auth = admin.auth();

export async function getAuthUser(req) {
    /* Retrieve the ID-Token from `req`, and use it to retrieve user info.
     * https://firebase.google.com/docs/auth/admin/verify-id-tokens */

    // Get token from the headers
    const {authorization} = req.headers;
    if (!authorization) return {};
    const token = authorization.split("Bearer ")[1];
    if (!token) return {};

    let user = null;
    try { // Get the user info from our auth service
        user = await auth.verifyIdToken(token);
    } catch (e) {
        console.log("Firebase ID Token Error:");
        console.log(e);
    }
    if (!user) return {};
    // add the user to the context
    return { user };
}
