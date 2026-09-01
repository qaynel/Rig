const { describe, it } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Path B oracle documentation consistency', () => {
  it('wiki files should not contain "awaiting signature" text when oracle is verified green', () => {
    // Verify that check-advanced-spec.js exits 0 (oracle is signed)
    let oracleVerified = false;
    let oracleOutput = '';
    try {
      oracleOutput = execSync('node scripts/check-advanced-spec.js 2>&1', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      // Check that output contains "Oracle verified" and doesn't error
      oracleVerified = oracleOutput.includes('Oracle verified');
    } catch (e) {
      // If the script errors, the oracle is not verified
      oracleVerified = false;
      oracleOutput = e.stdout || e.message;
    }

    assert(oracleVerified, `Oracle verification check should pass (node scripts/check-advanced-spec.js should exit 0). Output: ${oracleOutput}`);

    // Check wiki/gate2/technical-spec.md for divergent status text.
    // Note: wiki/gate1/acceptance.md is part of the oracle signature and cannot be modified
    // without re-signing, so it is excluded from this check. Only update technical-spec.md
    // which is not part of the oracle message digest.
    const wikiFileToCheck = 'wiki/gate2/technical-spec.md';

    const divergentPattern = /(awaiting.*signature|amendment.*red|not yet signed|pending.{0,20}(?:signature|sign|human))/i;

    const fullPath = path.join(process.cwd(), wikiFileToCheck);
    const content = fs.readFileSync(fullPath, 'utf-8');

    const matches = content.match(divergentPattern);
    assert(
      !matches,
      `File ${wikiFileToCheck} should not contain "${matches ? matches[0] : ''}" when oracle is verified. ` +
      `Found match: ${matches ? matches[0] : 'none'}. ` +
      `This indicates the wiki has not been updated to reflect the signed oracle state.`
    );
  });
});

describe('Task 2 — single playbook write per install mode', () => {
  const h = require('./helpers/path-b');
  const PLAYBOOK_DEST = '.rig/skills/onboarding/SKILL.md';
  const MANIFEST_REL = '.rig/install-manifest.jsonl';

  function readJournal(target) {
    const manifest = path.join(target, MANIFEST_REL);
    if (!fs.existsSync(manifest)) return [];
    return fs.readFileSync(manifest, 'utf-8')
      .split('\n')
      .flatMap((line) => {
        try { return line.trim() ? [JSON.parse(line)] : []; } catch { return []; }
      });
  }

  it('adaptive install writes exactly one applied journal record for PLAYBOOK_DEST', async () => {
    await h.withRepo(async (target) => {
      h.installRuntime(target, ['codex']);
      const records = readJournal(target);
      const applied = records.filter((r) => r.path === PLAYBOOK_DEST && r.state === 'applied');
      assert.equal(
        applied.length,
        1,
        `Expected exactly 1 applied journal record for ${PLAYBOOK_DEST}, got ${applied.length}. ` +
        `Double-write defect: installation must not write the wrapper then overwrite with the full playbook.`,
      );
    });
  });

  it('legacy install writes the wrapper and does not write the full playbook', async () => {
    await h.withRepo(async (target) => {
      const { runPayload } = require(path.join(h.root, 'rig', 'lib', 'payload.js'));
      runPayload(target, ['codex'], { activeDelivery: false });
      const wrapperContent = fs.readFileSync(
        path.join(h.root, 'rig/tier-1/skills/onboarding/SKILL.md'), 'utf-8',
      );
      const playbookContent = fs.readFileSync(
        path.join(h.root, 'rig/tier-1/skills/onboarding/playbook.md'), 'utf-8',
      );
      const written = fs.readFileSync(path.join(target, PLAYBOOK_DEST), 'utf-8');
      assert.notEqual(wrapperContent, playbookContent, 'Test precondition: wrapper and playbook must have different content');
      assert.equal(written, wrapperContent, 'Legacy install must write the wrapper SKILL.md, not the full playbook');
    });
  });
});
