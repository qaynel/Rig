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

    const divergentPattern = /(awaiting signature|amendment.*red|not yet signed|pending.*sign)/i;

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
