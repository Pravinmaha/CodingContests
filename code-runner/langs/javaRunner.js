import { writeFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';

export async function runJava(code) {
  const id = uuid().replace(/-/g, '').substring(0, 8);
  const filename = `temp/${id}.java`;
  const classname = id;
  const javaCode = code.replace(/class\s+\w+/, `class ${classname}`);
  await writeFile(filename, javaCode);

  return new Promise((resolve, reject) => {
    exec(`javac ${filename} && java -cp temp ${classname}`, async (err, stdout, stderr) => {
      await unlink(filename);
      await unlink(`temp/${classname}.class`).catch(() => {});
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}
