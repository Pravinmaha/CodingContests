import { writeFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';

export async function runPython(code) {
  const filename = `temp/${uuid()}.py`;
  await writeFile(filename, code);

  return new Promise((resolve, reject) => {
    exec(`python3 ${filename}`, async (err, stdout, stderr) => {
      await unlink(filename);
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}
