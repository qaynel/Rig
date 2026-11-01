'use strict';

// Phase-transition preflight: a transition is allowed only when every artefact
// required by the target phase already exists. The check is read-only; the run
// record changes only once nothing is missing. A required path ending in '/'
// must be a non-empty directory; any other path must be a file.
//
// Usage: const { enter } = require('./preflight'); enter(repoDir, 'implementation')

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { containedPath } = require('../../lib/path-safety');
const { policyPath, atomicWrite } = require('../../lib/policy-transaction');
const { readTrustRoot, verifyTrustRootApproval } = require('../../lib/trust-root');
const traceability = require('./check-traceability');
const release = require('./release-evidence');

const SIGN = 'owner runs node scripts/approve-gate1.js to sign the contract';
const REQUIRED = {
  onboarded: [
    { artefact: '.rig/rules/rig.md', remedy: 'run the rig-onboarding skill to graft Rig onto this repository' },
  ],
  intent_draft: [
    { artefact: '.rig/intent.md', remedy: 'record the business intent in .rig/intent.md with the rig-grilling skill' },
  ],
  oracle_draft: [
    { artefact: '.rig/contract/', remedy: 'draft requirements, criteria and the test manifest in .rig/contract/ with the rig-grilling skill' },
  ],
  oracle_signed: [
    { artefact: '.rig/oracle/signature', remedy: SIGN },
  ],
  designed: [
    { artefact: '.rig/oracle/signature', remedy: SIGN },
    { artefact: '.rig/contract/manifest.json', remedy: 'record the test manifest at .rig/contract/manifest.json with the rig-grilling skill' },
  ],
  implementation: [
    { artefact: '.rig/design/digest.json', remedy: 'run the rig-product-design skill and record its digest in .rig/design/digest.json' },
    { artefact: '.rig/packages.json', remedy: 'list the owned work packages in .rig/packages.json' },
    { artefact: '.rig/oracle/signature', remedy: SIGN },
  ],
  verification: [
    { artefact: '.rig/evidence/', remedy: 'run the package tests and save their results as files in .rig/evidence/' },
  ],
  release_ready: [
    { artefact: '.rig/evidence/full-gate.json', remedy: 'run npm test on the candidate commit and save the result as .rig/evidence/full-gate.json' },
  ],
  delivered: [
    { artefact: '.rig/release/receipt.json', remedy: 'complete the change-management sequence and write .rig/release/receipt.json (checked by node scripts/check-deployment-gate.js)' },
  ],
};
const PHASES = Object.keys(REQUIRED);
const ALIASES = { implementing: 'implementation', verifying: 'verification' };

function present(repo, artefact) {
  try {
    const abs = containedPath(repo, artefact);
    const st = fs.statSync(abs);
    return artefact.endsWith('/') ? st.isDirectory() && fs.readdirSync(abs).length > 0 : st.isFile();
  } catch {
    return false;
  }
}

// Returns the run record, {} when absent, or null when unreadable or not an object.
function readRun(runPath) {
  try {
    const state = JSON.parse(fs.readFileSync(runPath, 'utf8'));
    return state && typeof state === 'object' && !Array.isArray(state) ? state : null;
  } catch (err) {
    return err.code === 'ENOENT' ? {} : null;
  }
}

function verifyInputs(repo, phase) {
  const read = (rel) => JSON.parse(fs.readFileSync(containedPath(repo, rel), 'utf8'));
  const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
  if (['oracle_signed', 'designed', 'implementation'].includes(phase)) {
    const rel = '.rig/contract/manifest.json';
    const bytes = fs.readFileSync(containedPath(repo, rel));
    const manifest = JSON.parse(bytes);
    if (!manifest.files || !Object.keys(manifest.files).length) throw new Error('oracle manifest needs its complete protected files');
    for (const [file, digest] of Object.entries(manifest.files)) {
      if (!/^[a-f0-9]{64}$/.test(digest) || sha(fs.readFileSync(containedPath(repo, file))) !== digest) throw new Error(`protected file changed: ${file}`);
    }
    const contractDir = containedPath(repo, '.rig/contract');
    const graph = traceability.parse(contractDir);
    const errors = traceability.validate(graph);
    if (errors.length) throw new Error(`incomplete traceability: ${errors.join('; ')}`);
    for (const name of ['15-gate1-contract.md', '16-test-manifest.md', '17-customer-lifecycle.md']) {
      if (!manifest.files[`.rig/contract/${name}`]) throw new Error(`oracle manifest omits ${name}`);
    }
    for (const fixture of graph.fixtures.values()) {
      const homes = [...fixture.home.matchAll(/`([^`]+\.test\.js)`/g)].map((m) => m[1]);
      if (!homes.length || homes.some((file) => !manifest.files[file])) throw new Error(`oracle manifest omits proving tests for ${fixture.id}`);
    }
    verifyTrustRootApproval(repo, {
      identity: readTrustRoot(repo).identity, namespace: 'rig-gate1',
      message: `rig-ai-sdlc-freeze-v1\ncontract.manifest ${sha(bytes)}\n`,
      signature: fs.readFileSync(containedPath(repo, '.rig/oracle/signature'), 'utf8'),
    });
    if (phase === 'implementation') {
      const design = read('.rig/design/digest.json');
      if (!design.files || !Object.keys(design.files).length) throw new Error('design digest must name current design files');
      for (const [file, digest] of Object.entries(design.files)) {
        if (sha(fs.readFileSync(containedPath(repo, file))) !== digest) throw new Error(`stale design digest: ${file}`);
      }
      const audit = require('./work-packages').audit(repo, { file: '.rig/packages.json', approved: [...graph.requirements.keys()], persist: false });
      if (audit.problems.length || !audit.order.length) throw new Error(`invalid package graph: ${audit.problems.join('; ') || 'no packages'}`);
    }
  }
  if (['verification', 'release_ready'].includes(phase)) {
    const names = phase === 'release_ready' ? ['full-gate.json'] : fs.readdirSync(containedPath(repo, '.rig/evidence')).filter((n) => n.endsWith('.json'));
    if (!names.length) throw new Error('no completed verification evidence');
    for (const name of names) {
      const row = read(`.rig/evidence/${name}`);
      if (row.status !== 'pass' || row.exit_code !== 0 || row.digest !== release.sourceDigest(repo)) throw new Error(`failed or stale evidence: ${name}`);
    }
  }
  if (phase === 'delivered') {
    const receipt = read('.rig/release/receipt.json');
    if (receipt.commit !== release.sourceDigest(repo) || !release.validatePublished(repo, { artifact: receipt.artifact, health: 'pass' }).healthy) throw new Error('missing or stale publication receipt');
  }
}

function enterBase(repo, to) {
  const phase = Object.hasOwn(ALIASES, to) ? ALIASES[to] : to;
  if (!PHASES.includes(phase)) {
    return { allowed: false, missing: [{ artefact: `phase:${to}`, remedy: `use a known phase: ${PHASES.join(', ')}` }] };
  }

  const missing = REQUIRED[phase]
    .filter(({ artefact }) => !present(repo, artefact))
    .map(({ artefact, remedy }) => ({ artefact, remedy }));
  if (missing.length) return { allowed: false, missing };
  try { verifyInputs(repo, phase); }
  catch (error) { return { allowed: false, missing: [{ artefact: `validated inputs for ${phase}`, remedy: `repair inputs before retrying: ${error.message}` }] }; }

  // A corrupt run record is refused, not overwritten: its contents may be evidence.
  try {
    const runPath = policyPath(repo, '.rig/run.json');
    const state = readRun(runPath);
    if (!state) {
      return { allowed: false, missing: [{ artefact: '.rig/run.json', remedy: 'repair or remove .rig/run.json: it is not a JSON object' }] };
    }
    if (state.phase === to) return { allowed: true, missing: [] };
    state.phase = to;
    const nextRun = `${JSON.stringify(state, null, 2)}\n`;
    try {
      atomicWrite(repo, '.rig/run.json', nextRun);
    } catch (error) {
      try {
        if (fs.readFileSync(policyPath(repo, '.rig/run.json'), 'utf8') === nextRun) {
          return {
            allowed: true,
            missing: [],
            durability: 'uncertain',
            warnings: [`run record is visible, but durability could not be confirmed: ${error.message}`],
          };
        }
      } catch { /* Refuse when the committed bytes cannot be safely confirmed. */ }
      throw error;
    }
    return { allowed: true, missing: [] };
  } catch (error) {
    return { allowed: false, missing: [{ artefact: '.rig/run.json', remedy: `repair the run record path before retrying: ${error.message}` }] };
  }
}

function enter(repo, to, options = {}) {
  if (!options.strength) return enterBase(repo, to);
  let strength;
  try { strength = require('./strength').measure({ repo, ...options.strength }); }
  catch (error) { return { allowed: false, missing: [{ artefact: 'test strength', remedy: error.message }] }; }
  if (!strength.ok) {
    if (!strength.gap || options.acceptGap !== true) return { allowed: false, missing: [{ artefact: 'test strength', remedy: strength.gap || `mutation score ${strength.score} is below ${strength.floor}` }], strength };
    const rel = '.rig/strength-gaps.json';
    try {
      const file = containedPath(repo, rel);
      let records = [];
      try { records = JSON.parse(fs.readFileSync(file, 'utf8')); if (!Array.isArray(records)) throw new Error(); }
      catch (error) { if (error.code !== 'ENOENT') throw new Error(`${rel} is invalid JSON`); }
      records.push({ language: strength.language, gap: strength.gap, changedFiles: options.strength.changedFiles, accepted_at: new Date().toISOString() });
      atomicWrite(repo, rel, `${JSON.stringify(records, null, 2)}\n`);
    } catch (error) { return { allowed: false, missing: [{ artefact: rel, remedy: `record the accepted gap safely: ${error.message}` }], strength }; }
  }
  return { ...enterBase(repo, to), strength };
}

module.exports = { enter, verifyInputs };
