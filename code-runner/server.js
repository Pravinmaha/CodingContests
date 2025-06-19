import express from 'express';
import bodyParser from 'body-parser';
import { codeQueue } from './queue.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/api/run', (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  codeQueue.add({ code, language }, res);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
