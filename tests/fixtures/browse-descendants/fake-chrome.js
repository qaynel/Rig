// Forking stand-in for Chromium: forks a descendant (like a renderer/GPU
// process), then serves the two CDP discovery endpoints the importer polls.
// FAKE_CHROME_MODE=hang never serves them (startup timeout path).
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');

const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' });
fs.writeFileSync(process.env.FAKE_CHROME_CHILD_PID, String(child.pid));

const portArg = process.argv.find((a) => a.startsWith('--remote-debugging-port='));
const port = Number(portArg.split('=')[1]);
if (process.env.FAKE_CHROME_MODE === 'hang') {
  setInterval(() => {}, 1000);
} else {
  http.createServer((req, res) => {
    res.setHeader('content-type', 'application/json');
    if (req.url === '/json/version') res.end(JSON.stringify({ Browser: 'FakeChrome/1.0' }));
    else res.end(JSON.stringify([{ type: 'page', webSocketDebuggerUrl: `ws://127.0.0.1:${port}/devtools/page/1` }]));
  }).listen(port, '127.0.0.1');
}
