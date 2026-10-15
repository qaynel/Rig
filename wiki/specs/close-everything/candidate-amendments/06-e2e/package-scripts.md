# Candidate amendment — clean-install E2E package entrypoint

**Status: CANDIDATE, unsigned.** The agent did not edit `package.json` scripts
or `wiki/gate1/package-scripts.json`. The owner applies the matching signed-pin
update before the command becomes available.

## Add `test:e2e`

`scripts/clean-install-e2e.js` already accepts `--sha <commit>` and `--out
<evidence.json>`, defaults to `HEAD` and `.context/e2e-evidence.json`, and
refuses an uncommitted exact-SHA run. Add only this script entry, leaving
`npm test` unchanged:

```diff
 "test:rig": "node --test tests/rig-bootstrap.test.js",
+"test:e2e": "node scripts/clean-install-e2e.js",
 "test:secrets": "node --test tests/repo-secret-hygiene.test.js tests/repo-secret-fixtures.test.js"
```

Update the `test:e2e` entry in the signed snapshot
`wiki/gate1/package-scripts.json` in the same owner re-sign. This entrypoint
will run the real networked clean-install flow and write its default evidence
file under `.context/`.
