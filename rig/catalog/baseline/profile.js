'use strict';

// Portable developer-preference profile. export() yields only scalar,
// non-secret preferences from <repo>/.rig/preferences.json. import() merges a
// profile into a repository without overwriting local values: conflicts are
// reported, never applied, and every top-level or secret-like field is rejected.

const fs = require('node:fs');
const path = require('node:path');

const SCHEMA_VERSION = 1;
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const SECRET_KEY = /token|secret|passw|credential|signer|api[_-]?key|private[_-]?key/i;
const SECRET_VALUE = [/sk-[A-Za-z0-9-]{8,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /ssh-(ed25519|rsa|ecdsa)/, /allowed-signers/];

const prefsFile = (repo) => path.join(repo, '.rig', 'preferences.json');
const isScalar = (v) => ['string', 'number', 'boolean'].includes(typeof v);
const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isPlainObject = (v) => {
  if (v === null || typeof v !== 'object') return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};

function secretLike(key, value) {
  return SECRET_KEY.test(key) || (typeof value === 'string' && SECRET_VALUE.some((re) => re.test(value)));
}

function readPrefs(repo) {
  let text;
  try {
    text = fs.readFileSync(prefsFile(repo), 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
  const parsed = JSON.parse(text); // malformed local prefs throw rather than being overwritten
  if (!isPlainObject(parsed)) throw new Error('.rig/preferences.json must hold a JSON object');
  return parsed;
}

function exportProfile(repo) {
  const preferences = {};
  for (const [key, value] of Object.entries(readPrefs(repo))) {
    if (!UNSAFE_KEYS.has(key) && isScalar(value) && !secretLike(key, value)) preferences[key] = value;
  }
  return { schema_version: SCHEMA_VERSION, preferences };
}

function importProfile(repo, profile) {
  if (!isPlainObject(profile)) throw new Error('profile must be a plain object');
  if (profile.schema_version !== SCHEMA_VERSION) {
    throw new Error(`unsupported profile schema_version: ${profile.schema_version}`);
  }
  if (!isPlainObject(profile.preferences)) throw new Error('profile.preferences must be a plain object');

  const report = { applied: [], conflicted: [], rejected: [] };
  for (const key of Object.keys(profile)) {
    if (key !== 'schema_version' && key !== 'preferences') report.rejected.push(key);
  }

  const local = readPrefs(repo);
  const merged = { ...local };
  for (const key of Object.keys(profile.preferences)) {
    const value = profile.preferences[key];
    if (UNSAFE_KEYS.has(key) || !isScalar(value) || secretLike(key, value)) {
      report.rejected.push(key);
    } else if (!hasOwn(local, key)) {
      merged[key] = value;
      report.applied.push(key);
    } else if (local[key] !== value) {
      report.conflicted.push(key);
    }
  }

  if (report.applied.length > 0) {
    fs.mkdirSync(path.dirname(prefsFile(repo)), { recursive: true });
    fs.writeFileSync(prefsFile(repo), `${JSON.stringify(merged, null, 2)}\n`);
  }
  return report;
}

module.exports = { export: exportProfile, import: importProfile };
