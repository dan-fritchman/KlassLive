
// KlassLive API Server - "Stand-Alone" Edition
// 
// Entry-point for a "full" Apollo server,
// lacking any of the serverless invocation stuff

import "dotenv/config";
import server, {ready} from "./server";

// import sms from "./sms";
// if (NODE_ENV !== "dev") sms(`Klass.Live ${NODE_ENV} API Server Started`);

ready()
    .then(_ => console.log(`API Server Prep Ready`))
    .then(_ => server.listen({port: REACT_APP_KLASSLIVE_GRAPHQL_PORT}))
    .then(({url}) => console.log(`API Server ready at ${url}`));

