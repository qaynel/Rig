'use strict';

const test = require('node:test');
const { assert, fs, path, capability, tempRepo, write, denyNetwork, environmentBound } = require('./_harness');

// F27 — a fresh real-download install on each supported environment, with the
// network denied and no provider credential.
const SUPPORTED = ['darwin', 'linux', 'win32'];

function downloadedArchive() {
  const archive = process.env.RIG_PUBLIC_ARCHIVE;
  return archive && fs.existsSync(archive) ? archive : null;
}

test('PT-066 two supported host entrypoints run the same contract journey', () => {
  const repo = tempRepo('rig-portability-');
  const portability = capability('portability');

  const runs = ['claude', 'codex'].map((host) => portability.runJourney(repo, { host, journey: 'J01' }));

  assert.equal(runs.length, 2);
  assert.deepEqual(runs[0].steps, runs[1].steps, 'both host entrypoints run the same contract journey');
  for (const run of runs) {
    assert.equal(run.required_vendor_runtime, false, 'the core must not require a vendor runtime');
    assert.equal(run.completed, true);
  }
});

test('PT-068 offline install completes a meaning-based memory query from shipped assets', () => {
  const archive = downloadedArchive();
  if (!archive) {
    environmentBound('set RIG_PUBLIC_ARCHIVE to a really downloaded public archive; a repository checkout is not install evidence');
  }
  const repo = tempRepo('rig-offline-install-');
  const portability = capability('portability');
  const guard = denyNetwork();
  let result;
  try {
    portability.installArchive(repo, archive);
    result = portability.memoryQuery(repo, { store: 'Steps to stop an automatic subscription charge.', query: 'How do I cancel a recurring payment?' });
  } finally { guard.restore(); }

  assert.deepEqual(guard.calls, [], 'a default install needs no network');
  assert.equal(result.provider_account_required, false);
  assert.equal(result.separate_service_required, false);
  assert.ok(result.hit && result.hit.source, 'the result is cited');
});

test('PT-077 a clean real-download install finds the pinned model, tokenizer and runtime without a first-run download', () => {
  const archive = downloadedArchive();
  if (!archive) {
    environmentBound('set RIG_PUBLIC_ARCHIVE to a really downloaded public archive; this criterion cannot be proven from the source tree');
  }
  const repo = tempRepo('rig-assets-');
  const portability = capability('portability');
  portability.installArchive(repo, archive);

  const assets = portability.inferenceAssets(repo);
  for (const kind of ['model', 'tokenizer', 'runtime']) {
    const asset = assets.find((a) => a.kind === kind);
    assert.ok(asset, `the ${kind} must ship inside the archive`);
    assert.ok(fs.existsSync(path.join(repo, asset.path)), `${kind} is present after install`);
    assert.equal(asset.downloaded_at_first_run, false, `${kind} must not be fetched on first run`);
    assert.match(asset.digest, /^[0-9a-f]{64}$/, `${kind} is integrity checked`);
    assert.ok(asset.licence, `${kind} declares its licence`);
    assert.ok(asset.bytes > 0, `${kind} declares its size`);
  }
  const claimed = portability.supportedPlatforms(repo);
  for (const platform of claimed) {
    assert.ok(SUPPORTED.includes(platform), `unexpected claimed platform ${platform}`);
  }
  assert.ok(claimed.includes(process.platform), 'this environment is one of the claimed platforms');
});
