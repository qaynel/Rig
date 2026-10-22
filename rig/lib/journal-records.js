'use strict';

const fs = require('node:fs');
const { containedPath } = require('./path-safety');

const MANIFEST_REL = '.rig/install-manifest.jsonl';
const LEGACY_MANIFEST_REL = '.rig/install-manifest.json';

function parseJournalRecords(text) {
  const lines = String(text).split('\n');
  const records = [];
  const sequences = new Map();
  let maximum = 0;
  const ownerships = new Set(['create_owned', 'replace_owned', 'append_managed', 'graft_managed', 'merge_namespaced', 'delete_owned', 'user_owned', 'host_adapter', 'lint_format_config']);
  const sha256 = (value) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
  const validDigest = (value) => value === null || sha256(value);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    let record;
    try { record = JSON.parse(line); } catch {
      if (i === lines.length - 1 && !text.endsWith('\n')) { Object.defineProperty(records, 'truncated_tail', { value: true }); break; }
      throw new Error(`manifest record is invalid (line ${i + 1})`);
    }
    try {
      if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error('record must be an object');
      if (record.kind === 'install_state') {
        if (typeof record.complete !== 'boolean') throw new Error('install_state.complete must be boolean');
        if (Object.hasOwn(record, 'owner') && record.owner !== null && typeof record.owner !== 'string') throw new Error('install_state.owner must be a string or null');
        if (Object.hasOwn(record, 'recovery') && (record.recovery !== 'truncated-final-record' || typeof record.truncated_record_base64 !== 'string')) throw new Error('install_state recovery metadata is invalid');
      } else {
        if (!Number.isInteger(record.seq) || record.seq < 1 || typeof record.path !== 'string' || !record.path) throw new Error('record needs a positive sequence and path');
        if (!['pending', 'applied'].includes(record.state)) throw new Error('record needs a valid operation state');
        if (!ownerships.has(record.ownership)) throw new Error('record needs a valid ownership');
        if (!ownerships.has(record.operation) || record.operation !== record.ownership) throw new Error('record needs a matching operation');
        if (!['install', 'user_seed'].includes(record.transaction_kind)) throw new Error('record needs a valid transaction kind');
        if (!Object.hasOwn(record, 'desired_digest') || !validDigest(record.desired_digest)) throw new Error('record needs a valid desired digest');
        const createdFile = record.ownership === 'create_owned' && record.operation === 'create_owned'
          && record.state === 'applied' && sha256(record.desired_digest)
          && record.digest === record.desired_digest;
        if ((!Object.hasOwn(record, 'preimage_digest') && !createdFile)
          || (Object.hasOwn(record, 'preimage_digest') && !validDigest(record.preimage_digest))) {
          throw new Error('record needs a valid preimage digest');
        }
        if (record.operation === 'delete_owned') {
          if (record.desired_digest !== null || (record.state === 'applied' && record.digest !== null)) throw new Error('delete record must describe absence');
        } else if (record.desired_digest === null) throw new Error('non-delete record needs desired bytes');
        if (record.state === 'pending') {
          if (Object.hasOwn(record, 'digest')) throw new Error('pending operation cannot have an applied digest');
        } else if (!Object.hasOwn(record, 'digest') || (record.operation === 'delete_owned'
          ? record.digest !== null : !sha256(record.digest) || record.digest !== record.desired_digest)) {
          throw new Error('applied operation needs its result digest');
        }
        if (record.transaction_kind === 'user_seed' && record.ownership !== 'user_owned') throw new Error('user_seed must be user_owned');
        const prior = sequences.get(record.seq);
        if (prior) {
          for (const key of ['path', 'ownership', 'operation', 'transaction_kind', 'desired_digest', 'preimage_digest']) {
            if (JSON.stringify(prior[key]) !== JSON.stringify(record[key])) throw new Error(`contradictory sequence ${record.seq}`);
          }
          if (prior.state !== 'pending' || record.state !== 'applied' || (prior.digest && record.digest !== prior.digest)) throw new Error('invalid operation history');
        } else if (record.seq <= maximum) throw new Error('non-monotonic sequence');
        maximum = Math.max(maximum, record.seq);
        sequences.set(record.seq, record);
      }
      records.push(record);
    } catch (error) {
      throw new Error(`manifest record is invalid (line ${i + 1}): ${error.message}`);
    }
  }
  return records;
}

function readManifest(target) {
  const file = containedPath(target, MANIFEST_REL);
  if (fs.existsSync(file)) {
    return { format: 'jsonl', records: parseJournalRecords(fs.readFileSync(file, 'utf8')) };
  }
  const legacy = containedPath(target, LEGACY_MANIFEST_REL);
  if (!fs.existsSync(legacy)) return { format: 'jsonl', records: [] };
  const records = JSON.parse(fs.readFileSync(legacy, 'utf8')).records;
  if (!Array.isArray(records)) throw new Error('legacy manifest records must be an array');
  return { format: 'json', records: parseJournalRecords(records.map(record => JSON.stringify(record)).join('\n') + '\n') };
}

function latestOperations(records) {
  const bySeq = new Map();
  for (const record of records) {
    if (Number.isInteger(record.seq)) bySeq.set(record.seq, record);
  }
  return [...bySeq.values()].sort((a, b) => a.seq - b.seq);
}

// An install is incomplete while its newest install_state record says so or the
// journal holds a pending operation nothing later applied. Callers withhold every
// protection claim until it is not.
function installState(target) {
  const { records } = readManifest(target);
  const states = records.filter((record) => record.kind === 'install_state');
  const pending_paths = latestOperations(records).filter((record) => record.state === 'pending').map((record) => record.path);
  const incomplete = Boolean(records.truncated_tail) || pending_paths.length > 0 || (states.length > 0 && states[states.length - 1].complete === false);
  return { complete: !incomplete, pending_paths };
}

module.exports = { parseJournalRecords, readManifest, latestOperations, installState };
