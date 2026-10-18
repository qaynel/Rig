#!/usr/bin/env node
'use strict';

function findHealthIssue(issues, sha) {
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('health report requires a full commit SHA');
  const issue = issues.find((row) => !row.pull_request
    && (row.labels || []).some((label) => (typeof label === 'string' ? label : label.name) === 'health')
    && row.body?.includes(`<!-- rig-health sha=${sha} -->`));
  return issue ? { method: 'PATCH', number: issue.number } : { method: 'POST' };
}

async function main() {
  const { GITHUB_TOKEN, GITHUB_REPOSITORY, HEALTH_SHA, HEALTH_RUN_ID, HEALTH_RESULT, HEALTH_RUN_URL } = process.env;
  if (!GITHUB_TOKEN || !/^[\w.-]+\/[\w.-]+$/.test(GITHUB_REPOSITORY || '')
      || !/^[a-f0-9]{40}$/.test(HEALTH_SHA || '') || !/^\d+$/.test(HEALTH_RUN_ID || '')
      || !['success', 'failure', 'cancelled'].includes(HEALTH_RESULT)) {
    throw new Error('health report is missing validated GitHub run context');
  }
  if (HEALTH_RESULT === 'success') {
    process.stdout.write(`health succeeded for ${HEALTH_SHA}; no failure issue created or reopened\n`);
    return;
  }
  const api = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues`;
  const headers = { Accept: 'application/vnd.github+json', Authorization: `Bearer ${GITHUB_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28' };
  const issues = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${api}?state=all&labels=health&per_page=100&page=${page}`, { headers });
    if (!response.ok) throw new Error(`health issue lookup failed: HTTP ${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('health issue lookup returned invalid data');
    issues.push(...rows);
    if (rows.length < 100) break;
  }
  const existing = findHealthIssue(issues, HEALTH_SHA);
  const marker = `<!-- rig-health sha=${HEALTH_SHA} -->`;
  const body = `${marker}\n\nHealth workflow result: **${HEALTH_RESULT}**.\n\n- Commit: \`${HEALTH_SHA}\`\n- Run: [${HEALTH_RUN_ID}](${HEALTH_RUN_URL})\n`;
  const url = existing.method === 'PATCH' ? `${api}/${existing.number}` : api;
  const response = await fetch(url, {
    method: existing.method,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: `health: ${HEALTH_SHA}`, body, labels: ['health'], ...(existing.method === 'PATCH' ? { state: 'open' } : {}) }),
  });
  if (!response.ok) throw new Error(`health issue report failed: HTTP ${response.status}`);
  process.stdout.write(`health issue ${existing.method === 'POST' ? 'created' : 'updated'} for ${HEALTH_SHA}\n`);
}

if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
module.exports = { findHealthIssue };
