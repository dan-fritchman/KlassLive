/*
 * KlassLive API Server
 *
 * - Create Apollo GraphQL Server
 * - Create per-request contexts
 */

import gql from 'graphql-tag'
import mongoose from "mongoose";
import Stripe from "stripe";

import { ServerClass } from "./config"
import db from "./db";
import runner from "./runners/runner";
import {getLoaders} from "./db/loaders";
import {resolvers} from "./resolvers";
import {getAuthUser} from "./auth";


const {NODE_ENV, REACT_APP_KLASSLIVE_GRAPHQL_PORT, KLASSLIVE_STRIPE_SECRET_KEY} = process.env;

if (!REACT_APP_KLASSLIVE_GRAPHQL_PORT) throw new Error("No GQL Port Configured");
// if (!KLASSLIVE_STRIPE_SECRET_KEY) throw new Error("No Payment Key");


import typeDefsStr from "schema.graphql";
const typeDefs = gql`${typeDefsStr}`;

const getContext = async ({req}) => {
    /* Create and return the per-request GQL context */
    let numDbQueries = 0;
    mongoose.set('debug', (coll, method, query, doc) => {
        numDbQueries += 1; // FIXME: does this ever get tripped up? Maybe
        console.log(`Mongoose Query ${numDbQueries}`, coll, method); //, query, doc);
    });

    const authUser = await getAuthUser(req);
    const loaders = await getLoaders();
    return {
        ...authUser,
        numDbQueries,
        loaders,
        stripe: Stripe(KLASSLIVE_STRIPE_SECRET_KEY)
    };
};

const server = new ServerClass({
    typeDefs,
    resolvers,
    context: getContext,
    introspection: true,
    playground: false,
});

// Start-up & prep actions: DB connection etc. 
const getReady = () => Promise.all([db.ready(), runner.ready()]);
const readyState = getReady(); // Promise kicked off at import time. 
const ready = () => readyState;

export default server;
export {server, ready};

