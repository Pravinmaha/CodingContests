import { writeFile, unlink, mkdir } from 'fs/promises';
import { spawn } from 'child_process';
import { v4 as uuid } from 'uuid';
import { join } from 'path';

export async function runCpp(code, input) {
  const id = uuid().replace(/-/g, '').substring(0, 8);
  const cppFile = join('temp', `program_${id}.cpp`);
  const outFile = join('temp', `output_${id}`);

  await mkdir('temp', { recursive: true });
  await writeFile(cppFile, code);

  // Compile
  await new Promise((resolve, reject) => {
    const compile = spawn('g++', [cppFile, '-o', outFile]);
    let compileErr = '';
    compile.stderr?.on('data', (data) => {
      compileErr += data.toString();
    });
    compile.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(`Compilation failed:\n${compileErr}`);
    });
  });

  // Run with /usr/bin/time
  const result = await new Promise((resolve) => {
    const run = spawn('/usr/bin/time', [
      '-v',
      outFile
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
  await unlink(cppFile).catch(() => {});
  await unlink(outFile).catch(() => {});

  return result;
}
