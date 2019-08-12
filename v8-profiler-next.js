const { Worker } = require('worker_threads');

function mainSpin() {
    const start = Date.now();
    while (Date.now() - start < 10000);
}

const spin = `
'use strict';
const v8Profiler = require('v8-profiler-next');
const fs = require('fs');
const worker = require('worker_threads');
const path = require('path');
const epoch = (new Date()).getTime();
const title = \`\${process.pid}-\${worker.threadId}-\${epoch}\`;
// ex. 5 mins cpu profile
v8Profiler.startProfiling(title, true);
setTimeout(() => {
	const profile = v8Profiler.stopProfiling(title);
	profile.delete();
    const cpuProfilePath = path.join(\`node-\${title}.cpuprofile\`);
    fs.writeFile(cpuProfilePath, JSON.stringify(profile), (err) => {
        if (err) {
            console.error(\`Error saving profiling file \${cpuProfilePath}, \${err}\`);
        } else {
            console.info(\`Saved profiling file \${cpuProfilePath}\`);
        }
    });
}, 9 * 1000);

function workerSpin() {
    const start = Date.now();
    while (Date.now() - start < 10000);
}
workerSpin();
`;
// new Worker(spin, { eval: true });
new Worker(`
    const v8Profiler = require('v8-profiler-next');
    v8Profiler.startProfiling('', true);
    const start = Date.now();
    while (Date.now() - start < 10000);
`, { eval: true });
// new Worker(`
//     const v8Profiler = require('v8-profiler-next');
//     // v8Profiler.startProfiling('', true);
//     const start = Date.now();
//     while (Date.now() - start < 10000);
// `, { eval: true });
mainSpin();
