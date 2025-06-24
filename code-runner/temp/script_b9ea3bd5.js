class RefSolution {
    generateArray(n) {
        const arr = new Array(n);
        for (let i = 0; i < n; i++) {
            arr[i] = i + 1;
        }
        return arr;
    }
}

class RefSolution {
    generateArray(n) {
        let arr = {};
        for(let i = 0; i < n; i++){
            arr.add(i+1);
        }
        return arr;
    }
}


const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const refSol = new RefSolution();
const sol = new Solution();

let sb = "";
const inputs = [];

rl.on("line", function(str) {
    if (str.trim() !== '') {
        inputs.push(str.trim());
    }
});

rl.on("close", function() {
    for (const str of inputs) {
        const n = parseInt(str);

        if (n < 1 || n > 100) {
            sb += "Invalid TestCase " + n + " " + "\n";
            break;
        }

        const actualOutput = sol.generateArray(n);
        sb += "actualOutput=" + JSON.stringify(actualOutput) + "\n";

        const expectedOutput = refSol.generateArray(n);
        sb += "expectedOutput=" + JSON.stringify(expectedOutput) + "\n";
    }

    console.log(sb);
});
