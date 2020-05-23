

// Dummy Serverless Function Handler

import cors from 'micro-cors';

const handler = (req, res) => {
  res.send(`Hello !`)
}

export default cors()(handler);

