import { runJava } from './langs/javaRunner.js';
import { runC } from './langs/cRunner.js';
import { runCpp } from './langs/cppRunner.js';
import { runPython } from './langs/pythonRunner.js';
import { runJS } from './langs/jsRunner.js';

export async function executeCode(code, language) {
  switch (language.toLowerCase()) {
    case 'java': return runJava(code);
    case 'c': return runC(code);
    case 'cpp': return runCpp(code);
    case 'python': return runPython(code);
    case 'javascript': return runJS(code);
    default: throw new Error('Unsupported language');
  }
}
