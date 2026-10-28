'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const approve = require('../scripts/approve-gate1');

test('programme discovery protects digit, underscore and dotted test filenames and rejects traversal', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-oracle-names-'));
  const spec = approve.PROGRAMMES['ai-sdlc'];
  const contract = spec.contract;
  const files = [...spec.protected, ...['15-gate1-contract.md', '16-test-manifest.md', '17-customer-lifecycle.md'].map(f => path.join(contract, f))];
  try {
    for (const file of files) {
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.writeFileSync(path.join(root, file), 'fixture\n');
    }
    const names = ['regular.test.js', 'release_v2.test.js', 'release.v2.test.js'];
    for (const name of names) fs.writeFileSync(path.join(root, 'tests/ai-sdlc', name), 'fixture\n');
    const manifest = path.join(root, contract, '16-test-manifest.md');
    fs.writeFileSync(manifest, 'Directory `tests/ai-sdlc/`\n' + names.map(name => `\`tests/ai-sdlc/${name}\``).join('\n'));
    const discovered = approve.programmeProtectedFiles(root);
    for (const name of names) assert.ok(discovered.includes(`tests/ai-sdlc/${name}`), name);
    fs.appendFileSync(manifest, '\n`tests/ai-sdlc/../outside.test.js`\n');
    assert.throws(() => approve.programmeProtectedFiles(root), /invalid.*proving-test/i);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
