import { executeCode } from './executor.js';

class CodeQueue {
  constructor() {
    this.queue = [];
    this.isRunning = false;
  }

  add(job, res) {
    this.queue.push({ job, res });
    this.runNext();
  }

  async runNext() {
    if (this.isRunning || this.queue.length === 0) return;
    this.isRunning = true;

    const { job, res } = this.queue.shift();
    try {
      const data = await executeCode(job.code, job.language, job.input);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }

    this.isRunning = false;
    this.runNext();
  }
}

export const codeQueue = new CodeQueue();
