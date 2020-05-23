import mongoose from "mongoose";

import {models, createUserSession, updateOrCreateUser} from "./models";
import {getLoaders} from "./loaders";
// import migrations from "./migrations";


const fail = msg => {
    console.error(msg);
    process.exit(1);
};

const {KLASSLIVE_DB_URL, KLASSLIVE_DB_NAME} = process.env;
if (!KLASSLIVE_DB_URL) fail("DB URL Not Configured");
if (!KLASSLIVE_DB_NAME) fail("DB Name Not Configured");

export const ready = () => {
    return mongoose.connect(KLASSLIVE_DB_URL, {dbName: KLASSLIVE_DB_NAME, useNewUrlParser: true})
        .then(_ => console.log(`Connected to DB at ${KLASSLIVE_DB_URL}`))
        // .then(migrations) // FIXME: find a new time & place for these
        .then(_ => true)
        .catch(err => fail(err));
};

export default {
    ready,
    models,
    getLoaders,
    createUserSession,
    updateOrCreateUser
};

