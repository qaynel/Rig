'use strict';

// Shared fixture helpers for the isolated rebuild acceptance lane.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');

function product(relative) {
  const file = path.join(ROOT, relative);
  assert.ok(fs.existsSync(file), `missing rebuild interface: ${relative}`);
  return require(file);
}

function tempDir(prefix = 'rig-rebuild-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function write(root, relative, content) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.isBuffer(content) ? content : String(content));
  return file;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function networkBlockerSource(counterFile) {
  return `const fs=require('node:fs');const file=${JSON.stringify(counterFile)};` +
    `const hit=kind=>{fs.appendFileSync(file,kind+'\\n');throw Error('network denied: '+kind)};` +
    `const net=require('node:net');net.Socket.prototype.connect=function(){return hit('socket.connect')};` +
    `for(const name of ['node:http','node:https']){const api=require(name);api.request=function(){return hit(name+'.request')};api.get=function(){return hit(name+'.get')}}` +
    `global.fetch=function(){fs.appendFileSync(file,'fetch\\n');return Promise.reject(new Error('network denied: fetch'))};` +
    `const cp=require('node:child_process');const risky=(cmd,args)=>{const exe=require('node:path').basename(String(cmd));const argv=Array.isArray(args)?args.map(String):[];const text=[cmd,...argv].join(' ');return /^(curl|wget)$/.test(exe)||(/^(npm|npx|pnpm|yarn|pip|pip3)$/.test(exe)&&/\\b(install|add|update|upgrade|exec|view|download)\\b/.test(argv.join(' ')))||(/^git$/.test(exe)&&/\\b(clone|fetch|pull|push|ls-remote)\\b/.test(text))||(/^(sh|bash|zsh)$/.test(exe)&&/\\b(curl|wget|npm install|pnpm install|yarn install|pip install|git (clone|fetch|pull))\\b/.test(text))};` +
    `for(const method of ['spawn','spawnSync','exec','execSync','execFile','execFileSync']){const original=cp[method];cp[method]=function(cmd,args,...rest){if(risky(cmd,args))return hit('child_process.'+method+':'+cmd);return original.call(this,cmd,args,...rest)}}`;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  assert.ifError(result.error);
  return result;
}

module.exports = { ROOT, assert, fs, os, path, product, tempDir, write, sha256, run, networkBlockerSource };
