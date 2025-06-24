import { writeFile, unlink, mkdir } from 'fs/promises';
import { spawn } from 'child_process';
import { v4 as uuid } from 'uuid';
import { join } from 'path';

export async function runJava(code, input) {
  const id = uuid().replace(/-/g, '').substring(0, 8);
  const classname = `Class${id}`;
  const filename = join('temp', `${classname}.java`);

  await mkdir('temp', { recursive: true });

  const finalCode = code.replace(/public\s+class\s+Main|class\s+Main/, `class ${classname}`);
  await writeFile(filename, finalCode);

  // Compile
  await new Promise((resolve, reject) => {
    const compile = spawn('javac', [filename]);
    let compileErr = '';
    compile.stderr?.on('data', (data) => {
      compileErr += data.toString();
    });
    compile.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(`Compilation failed: ${classname}\n${compileErr}`);
    });
  });

  // Run with /usr/bin/time
  const result = await new Promise((resolve) => {
    const run = spawn('/usr/bin/time', [
      '-v', // verbose output to measure memory
      'java', '-cp', 'temp', classname
    ]);

    let stdout = '';
    let stderr = '';

    run.stdout.on('data', (data) => (stdout += data.toString()));
    run.stderr.on('data', (data) => (stderr += data.toString()));

    run.on('close', (code) => {
      const memoryMatch = stderr.match(/Maximum resident set size.*:\s+(\d+)/);
      const memory = memoryMatch ? parseInt(memoryMatch[1]) : null;

      const timeMatch = stderr.match(/User time.*:\s+([\d.]+)/);
      const time = timeMatch ? parseFloat(timeMatch[1]) : null;

      if (code !== 0) {
        resolve({ error: stderr || `Exited with code ${code}`, time, memory });
      } else {
        resolve({ output: stdout.trim(), time, memory });
      }
    });

    run.stdin.write(input || '');
    run.stdin.end();
  });

  // Clean up
  await unlink(filename).catch(() => {});
  await unlink(`temp/${classname}.class`).catch(() => {});
  await unlink('temp/Solution.class').catch(() => {});
  await unlink('temp/RefSolution.class').catch(() => {});

  return result;
}
