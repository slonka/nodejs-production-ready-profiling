# Support for profiling inside worker-threads

## Running node build in profiler

```
node --prof node-prof.js
```

Produces 2 isolate files, you can check that both functions were recorded by running:

```
cat isolate* | grep Spin

code-creation,LazyCompile,10,77539,0x1d090089cbee,57,mainSpin ./node-and-workers-on-demand-profiler/node-prof.js:3:18,0x1d094afe0bb8,~
code-creation,LazyCompile,0,80529,0x940d95c3ca0,576,mainSpin ./node-and-workers-on-demand-profiler/node-prof.js:3:18,0x1d094afe0bb8,*
code-creation,LazyCompile,10,35928,0x350387ff20ce,57,workerSpin [worker eval]:2:20,0x350387ff1630,~
code-creation,LazyCompile,0,37921,0x1be758583660,576,workerSpin [worker eval]:2:20,0x350387ff1630,*
```

## Running pprof on only main thread

```
node pprof-main.js
pprof -http=: wall.pb.gz
```

Seems to not contain `workerSpin()` function.

![flamegraph](flamegraph.png)


## Running pprof on both main and worker thread

This ends up in the following error:

```
node pprof-worker-main.js

events.js:180
      throw er; // Unhandled 'error' event
      ^
internal/modules/cjs/loader.js:817
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Module did not self-register.
    at Object.Module._extensions..node (internal/modules/cjs/loader.js:817:18)
    at Module.load (internal/modules/cjs/loader.js:643:32)
    at Function.Module._load (internal/modules/cjs/loader.js:556:12)
    at Module.require (internal/modules/cjs/loader.js:683:19)
    at require (internal/modules/cjs/helpers.js:16:16)
    at Object.<anonymous> (./node-and-workers-on-demand-profiler/node_modules/pprof/out/src/heap-profiler-bindings.js:21:18)
    at Module._compile (internal/modules/cjs/loader.js:776:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:787:10)
    at Module.load (internal/modules/cjs/loader.js:643:32)
    at Function.Module._load (internal/modules/cjs/loader.js:556:12)
Emitted 'error' event at:
    at Worker.[kOnErrorMessage] (internal/worker.js:176:10)
    at Worker.[kOnMessage] (internal/worker.js:186:37)
    at MessagePort.<anonymous> (internal/worker.js:118:57)
    at MessagePort.emit (events.js:203:13)
    at MessagePort.onmessage (internal/worker/io.js:70:8)
```
