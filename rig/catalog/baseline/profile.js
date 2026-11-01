'use strict';

// Portable developer-preference profile. export() yields only scalar,
// non-secret preferences from <repo>/.rig/preferences.json. import() merges a
// profile into a repository without overwriting local values: conflicts are
// reported, never applied, and every top-level or secret-like field is rejected.

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { containedPath } = require('../../lib/path-safety');

const SCHEMA_VERSION = 1;
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const SECRET_KEY = /token|secret|passw|credential|signer|api[_-]?key|private[_-]?key/i;
const PROJECT_KEY = /^(path|project|repo|repository|workspace|root)$/i;
const SECRET_VALUE = [/sk-[A-Za-z0-9-]{8,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /ssh-(ed25519|rsa|ecdsa)/, /allowed-signers/];

const prefsFile = (repo) => containedPath(repo, '.rig/preferences.json');
const homeProfileFile = () => process.env.RIG_PROFILE_HOME
  ? path.join(process.env.RIG_PROFILE_HOME, 'profile.json')
  : path.join(os.homedir(), '.rig', 'profile.json');
const LANGUAGE = Object.freeze({ everydayWords: true, noShorthand: true, noTechnicalConfirmations: true });
const isScalar = (v) => ['string', 'number', 'boolean'].includes(typeof v);
const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isPlainObject = (v) => {
  if (v === null || typeof v !== 'object') return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};

function secretLike(key, value) {
  return SECRET_KEY.test(key) || (typeof value === 'string' && (SECRET_VALUE.some((re) => re.test(value)) || /(?:^|[\s"'=])(?:[A-Za-z]:[\\/](?:[^\\/\s]+[\\/])*[^\\/\s]*|\\\\[^\\/\s]+[\\/][^\\/\s]+)(?=$|[\s"'])/.test(value)));
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
  const source = repo ? readPrefs(repo) : (() => {
    try { return JSON.parse(fs.readFileSync(homeProfileFile(), 'utf8')).preferences || {}; }
    catch (error) { if (error.code === 'ENOENT') return {}; throw error; }
  })();
  const preferences = repo ? {} : { language: { ...LANGUAGE } };
  for (const [key, value] of Object.entries(source)) {
    if (key === 'language' && isPlainObject(value)) {
      preferences.language = Object.fromEntries(Object.entries(value).filter(([name, flag]) => Object.hasOwn(LANGUAGE, name) && typeof flag === 'boolean'));
      continue;
    }
    if (!UNSAFE_KEYS.has(key) && !PROJECT_KEY.test(key) && isScalar(value) && !secretLike(key, value)) preferences[key] = value;
  }
  return { schema_version: SCHEMA_VERSION, preferences };
}

function mergeProfile(repo, profile) {
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
    if (key === 'language') {
      if (!isPlainObject(value) || Object.entries(value).some(([name, flag]) => !Object.hasOwn(LANGUAGE, name) || typeof flag !== 'boolean')) report.rejected.push(key);
      else if (!hasOwn(local, key)) { merged[key] = value; report.applied.push(key); }
      else if (JSON.stringify(local[key]) !== JSON.stringify(value)) report.conflicted.push(key);
      continue;
    }
    if (UNSAFE_KEYS.has(key) || PROJECT_KEY.test(key) || !isScalar(value) || secretLike(key, value)) {
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

function exportHome(repo) {
  const profile = exportProfile(repo || null);
  profile.preferences.language ||= { ...LANGUAGE };
  const file = homeProfileFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(profile, null, 2)}\n`, { mode: 0o600 });
  return file;
}

function importHome(file, repo) {
  const profile = JSON.parse(fs.readFileSync(file, 'utf8'));
  const report = mergeProfile(repo, profile);
  const sanitized = { schema_version: SCHEMA_VERSION, preferences: {} };
  for (const [key, value] of Object.entries(profile.preferences || {})) {
    if (key === 'language' && isPlainObject(value) && Object.entries(value).every(([name, flag]) => Object.hasOwn(LANGUAGE, name) && typeof flag === 'boolean')) sanitized.preferences.language = value;
    else if (!UNSAFE_KEYS.has(key) && !PROJECT_KEY.test(key) && isScalar(value) && !secretLike(key, value)) sanitized.preferences[key] = value;
  }
  fs.mkdirSync(path.dirname(homeProfileFile()), { recursive: true });
  fs.writeFileSync(homeProfileFile(), `${JSON.stringify(sanitized, null, 2)}\n`, { mode: 0o600 });
  return report;
}

function importProfile(first, second) {
  return typeof first === 'string' && typeof second === 'string'
    ? importHome(first, second)
    : mergeProfile(first, second);
}

module.exports = { export: exportProfile, import: importProfile, exportHome, importHome, homeProfileFile };
