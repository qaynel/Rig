'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REVIEW_RECEIPT = /^wiki\/sources\/reviews\/[^/]+\.review\.json$/;

function implementationDigest(root) {
  const listed = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: root,
    encoding: 'buffer',
    shell: false,
  });
  if (listed.status !== 0) {
    throw new Error(`implementation digest inventory failed: ${(listed.stderr || Buffer.alloc(0)).toString('utf8').trim()}`);
  }
  const files = [...new Set(listed.stdout.toString('utf8').split('\0').filter(Boolean))]
    .filter((rel) => !REVIEW_RECEIPT.test(rel))
    .sort();
  const hash = crypto.createHash('sha256');
  for (const rel of files) {
    const absolute = path.join(root, rel);
    const stat = fs.lstatSync(absolute);
    const kind = stat.isSymbolicLink() ? 'symlink' : 'file';
    const body = stat.isSymbolicLink() ? Buffer.from(fs.readlinkSync(absolute)) : fs.readFileSync(absolute);
    hash.update(`${kind}\0${(stat.mode & 0o777).toString(8)}\0${rel}\0${body.length}\0`).update(body);
  }
  return { digest: hash.digest('hex'), files: files.length };
}

function catalogueDigest(catalogPath) {
  const catalogBytes = fs.readFileSync(catalogPath);
  const catalog = JSON.parse(catalogBytes);
  const rigRoot = path.dirname(catalogPath);
  const fragments = [...new Set((catalog.services || []).flatMap((service) => [
    ...Object.values(service.fragments || {}),
    ...Object.values(service.slices || {}).map((slice) => slice && slice.fragment).filter(Boolean),
  ]))].sort();
  const hash = crypto.createHash('sha256').update(catalogBytes);
  for (const rel of fragments) hash.update(`\0${rel}\0`).update(fs.readFileSync(path.join(rigRoot, rel)));
  return hash.digest('hex');
}

function validateReviewReceipt(receipt, expected) {
  if (!receipt || receipt.kind !== 'report-only') {
    throw new Error('review receipt must be report-only');
  }
  if (!receipt.author_context || !receipt.reviewer_context) {
    throw new Error('review receipt needs author and reviewer contexts');
  }
  if (receipt.author_context === receipt.reviewer_context) {
    throw new Error('review must be fresh: reviewer context must differ from author context');
  }
  if (expected && expected.technical_spec_digest &&
      receipt.technical_spec_digest !== expected.technical_spec_digest) {
    throw new Error('technical_spec_digest mismatch');
  }
  if (expected && expected.catalogue_digest &&
      receipt.catalogue_digest !== expected.catalogue_digest) {
    throw new Error('catalogue_digest mismatch');
  }
  const implementationRequired = receipt.schema_version >= 2 ||
    Boolean(expected?.implementation_digest || expected?.implementation_base);
  if (implementationRequired && !receipt.implementation_digest) {
    throw new Error('implementation_digest required');
  }
  if (implementationRequired && !receipt.implementation_base) {
    throw new Error('implementation_base required');
  }
  if (expected?.implementation_digest && receipt.implementation_digest !== expected.implementation_digest) {
    throw new Error('implementation_digest mismatch');
  }
  if (expected?.implementation_base && receipt.implementation_base !== expected.implementation_base) {
    throw new Error('implementation_base mismatch');
  }
  if (!Array.isArray(receipt.unresolved) || receipt.unresolved.length) {
    throw new Error('review receipt has unresolved acceptance cases');
  }
  if (receipt.verdict !== undefined && receipt.verdict !== 'pass') {
    throw new Error('review receipt verdict must pass');
  }
  if (Array.isArray(receipt.findings) && receipt.findings.some((finding) => ['blocker', 'major'].includes(finding?.severity))) {
    throw new Error('review receipt contains release-blocking findings');
  }
  if (!expected || !Array.isArray(expected.acceptance_ids)) {
    throw new Error('expected acceptance coverage is required');
  }
  if (!Array.isArray(receipt.verdicts)) throw new Error('review receipt verdict coverage is required');
  const rows = receipt.verdicts.map((entry) => typeof entry === 'string' ? { id: entry, verdict: 'pass' } : entry);
  const ids = rows.map((entry) => entry && entry.id);
  if (new Set(ids).size !== ids.length) throw new Error('duplicate review verdict coverage');
  if (rows.some((entry) => !entry || entry.verdict !== 'pass')) throw new Error('case verdict must pass');
  const actual = [...ids].sort();
  const wanted = [...expected.acceptance_ids].sort();
  const missing = wanted.filter((id) => !actual.includes(id));
  const extra = actual.filter((id) => !wanted.includes(id));
  if (missing.length || extra.length) {
    throw new Error(`review verdict coverage mismatch: missing ${missing.join(',') || 'none'}; extra ${extra.join(',') || 'none'}`);
  }
  return true;
}

function validateWorkflowReceipt(receipt) {
  if (!receipt || !receipt.implementation_context || !receipt.review_context) {
    throw new Error('workflow receipt requires implementation and review contexts');
  }
  if (receipt.implementation_context === receipt.review_context) {
    throw new Error('implementation and review contexts must be distinct');
  }
  return true;
}

module.exports = { catalogueDigest, implementationDigest, validateReviewReceipt, validateWorkflowReceipt };
