import { runJava } from './langs/javaRunner.js';
import { runC } from './langs/cRunner.js';
import { runCpp } from './langs/cppRunner.js';
import { runPython } from './langs/pythonRunner.js';
import { runJs } from './langs/jsRunner.js';

export async function executeCode(code, language, input) {
  switch (language.toLowerCase()) {
    case 'java': return runJava(code, input);
    case 'c': return runC(code, input);
    case 'cpp': return runCpp(code, input);
    case 'python': return runPython(code, input);
    case 'js': return runJs(code, input);
    default: throw new Error('Unsupported language');
  }
}
