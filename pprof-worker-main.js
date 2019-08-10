const pprof = require('pprof');
const fs = require('fs');
const { Worker } = require('worker_threads');

async function a() {
    const profile = await pprof.time.profile({
        durationMillis: 9000,    // time in milliseconds for which to
                                // collect profile.
    });
    const buf = await pprof.encode(profile);
    fs.writeFile('./wall.pb.gz', buf, (err) => {
        if (err) throw err;
    });
}

a();

function mainSpin() {
    const start = Date.now();
    while (Date.now() - start < 10000);
}

const spin = `
const fs = require('fs');
const pprof = require('pprof');
async function a() {
    const profile = await pprof.time.profile({
        durationMillis: 9000,    // time in milliseconds for which to
                                // collect profile.
    });
    const buf = await pprof.encode(profile);
    fs.writeFile('./wall-worker.pb.gz', buf, (err) => {
        if (err) throw err;
    });
}

a();

function workerSpin() {
    const start = Date.now();
    while (Date.now() - start < 10000);
}
workerSpin();
`;
new Worker(spin, { eval: true });
mainSpin();
