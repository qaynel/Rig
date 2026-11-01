'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('catalogue CI derives both shard coordinates from the actual job matrix', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/test.yml'), 'utf8');
  const command = workflow.split('\n').find(line => line.includes('run: CATALOGUE_SHARD='));
  assert.match(command, /strategy\.job-index/);
  assert.match(command, /strategy\.job-total/);
  const services = require('../rig/lib/catalog').loadCatalog().services.length;
  for (const total of [1, 4, 5, 7]) {
    const seen = Array(services).fill(0);
    for (let job = 0; job < total; job += 1) {
      const expanded = command.trim().slice('run: '.length)
        .replace('scripts/test-linux.sh ', '')
        .replace(/\$\{\{ strategy\.job-index \}\}/g, job)
        .replace(/\$\{\{ strategy\.job-total \}\}/g, total);
      const result = require('node:child_process').spawnSync('sh', ['-c', expanded.replace(/node --test .*/, "node -p 'process.env.CATALOGUE_SHARD'")], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      const [part, count] = result.stdout.split('/').map(Number);
      assert.equal(count, total);
      assert.equal(part, job + 1);
      for (let service = 0; service < seen.length; service += 1) if (service % count === part - 1) seen[service] += 1;
    }
    assert.deepEqual(seen, Array(services).fill(1));
  }
});
