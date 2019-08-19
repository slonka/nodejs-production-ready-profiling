const { Worker } = require('worker_threads');
const inspector = require('inspector');
const fs = require('fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
  });
});

function mainSpin() {
    const start = Date.now();
    while (Date.now() - start < 10000);

    session.post('Profiler.stop', (err, { profile }) => {
      // Write profile to disk, upload, etc.
      if (!err) {
        fs.writeFileSync('./profile-main.cpuprofile', JSON.stringify(profile));
      }
      session.post('Profiler.disable', () => {
      });
    });
}

const spin = `
function workerSpin() {
    const inspector = require('inspector');
    const fs = require('fs');
    const session = new inspector.Session();
    session.connect();

    session.post('Profiler.enable', () => {
        session.post('Profiler.start', () => {
        });
    });

    const start = Date.now();
    while (Date.now() - start < 10000);

    session.post('Profiler.stop', (err, { profile }) => {
      // Write profile to disk, upload, etc.
      if (!err) {
        fs.writeFileSync('./profile-worker.cpuprofile', JSON.stringify(profile));
      }
    });
}
workerSpin();
`;
new Worker(spin, { eval: true });
mainSpin();
