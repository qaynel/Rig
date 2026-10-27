'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/ai-sdlc.yml'), 'utf8');

function job(name) {
  const start = workflow.indexOf(`  ${name}:\n`);
  assert.notEqual(start, -1, `workflow must define ${name}`);
  const next = workflow.slice(start + 1).search(/^  [A-Za-z0-9_-]+:\s*$/m);
  return workflow.slice(start, next < 0 ? undefined : start + 1 + next);
}

test('candidate acceptance stays provisional and public archive evidence runs only after stable publication', () => {
  assert.match(workflow, /^  push:\n/m, 'ordinary candidate pushes still run');
  assert.match(workflow, /^  pull_request:\s*$/m, 'ordinary pull requests still run');
  assert.match(workflow, /^  release:\n    types: \[published\]/m, 'publication triggers the post-publication lane');

  for (const name of ['archive', 'acceptance']) {
    assert.match(job(name), /if: github\.event_name != 'release'/, `${name} remains candidate-only`);
  }

  const published = job('test-offline');
  assert.match(published, /if: github\.event_name == 'release'.*github\.event\.action == 'published'.*github\.event\.release\.draft == false.*github\.event\.release\.prerelease == false/s,
    'the published-artifact lane excludes drafts and prereleases');
  assert.doesNotMatch(published, /needs: archive|continue-on-error: true|RIG_PUBLIC_ARCHIVE_URL|fallback/i,
    'publication proof cannot consume a candidate artifact, tolerate failure, or use a caller-selected fallback');
  assert.match(published, /ref: \$\{\{ github\.event\.release\.tag_name \}\}/,
    'the proof checks out the exact released tag');
  assert.match(published, /browser_download_url/,
    'the archive URL comes from the GitHub release asset metadata');
  assert.match(published, /node scripts\/verify-public-archive-digest\.js/,
    'the downloaded release bytes are checked against the independent digest');
  assert.match(published, /node --test tests\/ai-sdlc\/portability\.test\.js/,
    'the real downloaded artifact runs the existing offline-install proving cases');
  assert.match(published, /container: node:22-bookworm/,
    'published-byte offline acceptance runs in a clean Linux container');
  assert.match(published, /RIG_PUBLIC_ARCHIVE_SHA256: \$\{\{ vars\.RIG_PUBLIC_ARCHIVE_SHA256 \}\}/,
    'missing trusted digest remains a hard failure');
});

test('release event metadata selects only the matching canonical public asset', () => {
  const script = /ASSET_URL="\$\(node <<'NODE'\n([\s\S]*?)\n\s*NODE\n\s*\)"/.exec(job('test-offline'))?.[1];
  assert.ok(script, 'the workflow must contain an executable release asset selector');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-release-asset-'));
  const tag = 'v1.2.3';
  const expected = 'https://github.com/qaynel/Rig/releases/download/v1.2.3/rig-public-1.2.3.tar.gz';
  const url = 'https://github.com/qaynel/Rig/releases/download/v1.2.3/rig-public-1.2.3.tar.gz';
  function select(assets) {
    const eventFile = path.join(dir, 'event.json');
    fs.writeFileSync(eventFile, JSON.stringify({ release: { assets } }));
    return spawnSync(process.execPath, ['-e', script], {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_EVENT_PATH: eventFile, GITHUB_REPOSITORY: 'qaynel/Rig', RELEASE_TAG: tag },
    });
  }
  const asset = (browser_download_url = url) => ({ name: 'rig-public-1.2.3.tar.gz', browser_download_url });
  try {
    const valid = select([asset()]);
    assert.equal(valid.status, 0, valid.stderr);
    assert.equal(valid.stdout, expected);

    const wrongHost = select([asset('https://evil.example/qaynel/Rig/releases/download/v1.2.3/rig-public-1.2.3.tar.gz')]);
    assert.notEqual(wrongHost.status, 0);
    assert.match(wrongHost.stderr, /canonical GitHub release asset path/);

    const wrongTag = select([asset('https://github.com/qaynel/Rig/releases/download/v1.2.4/rig-public-1.2.3.tar.gz')]);
    assert.notEqual(wrongTag.status, 0);
    assert.match(wrongTag.stderr, /canonical GitHub release asset path/);

    const missing = select([]);
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /expected exactly one published/);

    const duplicate = select([asset(), asset()]);
    assert.notEqual(duplicate.status, 0);
    assert.match(duplicate.stderr, /expected exactly one published/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
