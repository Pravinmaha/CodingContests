import { writeFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';

export async function runJS(code) {
  const filename = `temp/${uuid()}.js`;
  await writeFile(filename, code);

  return new Promise((resolve, reject) => {
    exec(`node ${filename}`, async (err, stdout, stderr) => {
      await unlink(filename);
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}
