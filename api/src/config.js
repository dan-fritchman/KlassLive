
// Configure Server Runtime Environment
// Primarily differentiate between "serverless" micro-mode and "full" server-mode

const m = (process.env.KLASSLIVE_API_SERVER_MODE === "serverless") ? 
    require("apollo-server-micro") : 
    require("apollo-server");

module.exports.ServerClass = m.ApolloServer;

