'use strict';

const fs = require('node:fs');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function mergeGlobalConfig(file, { install_id, value }) {
  if (!install_id) throw new Error('install_id required');
  const current = fs.existsSync(file) ? readJson(file) : {};
  const rig = current.rig && typeof current.rig === 'object' ? current.rig : {};
  rig[install_id] = value;
  const next = { ...current, rig };
  writeJson(file, next);
  return { install_line: `rig install ${install_id} at ${file}`, path: file };
}

function removeGlobalConfig(file, install_id) {
  if (!fs.existsSync(file)) return { removed: false };
  const current = readJson(file);
  if (!current.rig || !(install_id in current.rig)) return { removed: false };
  delete current.rig[install_id];
  writeJson(file, current);
  return { removed: true };
}

module.exports = { mergeGlobalConfig, removeGlobalConfig };
