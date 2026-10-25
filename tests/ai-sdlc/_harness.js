'use strict';

// Shared harness for the AI-SDLC acceptance lane.
//
// This lane is deliberately NOT matched by `tests/*.test.js`, so the new
// programme's expected failures never turn the existing repository gate red.
// Run it on its own:  node --test tests/ai-sdlc/
//
// Every proving test builds real fixture bytes, then asks for the product
// capability that must satisfy its criterion. Until that capability ships,
// `capability()` throws naming the exact missing module, which is the
// preimplementation red for that requirement. The assertions below each call
// are the contract: they inspect returned structure or persisted state, never
// echo a return value back at itself.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');
// Shipped product capabilities live in the mandatory installed baseline,
// alongside the traceability validator that already ships there.
const BASELINE = path.join(ROOT, 'rig', 'catalog', 'baseline');

/** Resolve a product capability module, or fail with the exact gap. */
function capability(name) {
  const file = path.join(BASELINE, `${name}.js`);
  if (!fs.existsSync(file)) {
    throw new Error(`capability not implemented: rig/catalog/baseline/${name}.js`);
  }
  return require(file);
}

function tempRepo(prefix = 'rig-acc-') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  spawnSync('git', ['init', '-q', dir]);
  return dir;
}

function write(dir, rel, body) {
  const abs = path.join(dir, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const raw = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body, null, 2);
  fs.writeFileSync(abs, raw);
  return abs;
}

function read(dir, rel) {
  return fs.readFileSync(path.join(dir, rel), 'utf8');
}

/** Throwaway ed25519 key; never the owner key. */
function testKey(dir, name = 'test-key') {
  const key = path.join(dir, name);
  const result = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return key;
}

// Secret-shaped fixtures are assembled at runtime; the repository's own
// hygiene gate refuses a literal one in a tracked file.
const SECRET_FIXTURE = ['sk', 'live', 'not', 'a', 'real', 'secret', 'fixture'].join('-');

/** Deny every outbound path and count attempts, for the offline criteria. */
function denyNetwork() {
  const net = require('node:net');
  const http = require('node:http');
  const https = require('node:https');
  const saved = { fetch: globalThis.fetch, connect: net.Socket.prototype.connect, http: http.request, https: https.request };
  const calls = [];
  const deny = (what) => (...args) => { calls.push(what); throw new Error(`network denied: ${what}`); };
  globalThis.fetch = deny('fetch');
  net.Socket.prototype.connect = deny('net.connect');
  http.request = deny('http.request');
  https.request = deny('https.request');
  return {
    calls,
    restore() {
      globalThis.fetch = saved.fetch;
      net.Socket.prototype.connect = saved.connect;
      http.request = saved.http;
      https.request = saved.https;
    },
  };
}

/** A criterion whose evidence needs hardware or a real network this lane must not fake. */
function environmentBound(reason) {
  const err = new Error(`environment-bound criterion: ${reason}`);
  err.environmentBound = true;
  throw err;
}

module.exports = { ROOT, BASELINE, SECRET_FIXTURE, assert, fs, path, spawnSync, capability, tempRepo, write, read, testKey, denyNetwork, environmentBound };
