import { writeFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';

export async function runC(code) {
  const id = uuid();
  const filename = `temp/${id}.c`;
  const output = `temp/${id}`;
  await writeFile(filename, code);

  return new Promise((resolve, reject) => {
    exec(`gcc ${filename} -o ${output} && ${output}`, async (err, stdout, stderr) => {
      await unlink(filename);
      await unlink(output).catch(() => {});
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}
