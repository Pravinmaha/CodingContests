import { writeFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';

export async function runCpp(code) {
  const id = uuid();
  const filename = `temp/${id}.cpp`;
  const output = `temp/${id}`;
  await writeFile(filename, code);

  return new Promise((resolve, reject) => {
    exec(`g++ ${filename} -o ${output} && ${output}`, async (err, stdout, stderr) => {
      await unlink(filename);
      await unlink(output).catch(() => {});
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}
