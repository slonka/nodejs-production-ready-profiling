const { Worker } = require('worker_threads');

function mainSpin() {
    const start = Date.now();
    while (Date.now() - start < 10000);
}

const spin = `
function workerSpin() {
    const start = Date.now();
    while (Date.now() - start < 10000);
}
workerSpin();
`;
new Worker(spin, { eval: true });
mainSpin();
