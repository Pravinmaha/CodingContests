import express from 'express';
import bodyParser from 'body-parser';
import { codeQueue } from './queue.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/api/run', (req, res) => {
  try {

    const { code, language, input } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }
    
    codeQueue.add({ code, language, input }, res);
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: error.message })
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
