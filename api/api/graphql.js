
// Vercel/Zeit Now Serverless Function Handler

import "dotenv/config";
import cors from 'micro-cors';
import server, {ready} from "../build/server";

const gqlHandler = server.createHandler({ 
  path: '/api/graphql',
  disableHealthCheck: true,
});

const handler = async (req, res, ...args) => {
  if (req.method === "OPTIONS") return res.end(); // Required for CORS
  await ready(); // Wait for setup activity
  await gqlHandler(req, res, ...args);
};

export default cors()(handler);
