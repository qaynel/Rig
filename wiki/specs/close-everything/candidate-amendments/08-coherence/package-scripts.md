# Candidate amendment — run coherence in the code gate

**Status: CANDIDATE, unsigned.** Package scripts and
`wiki/gate1/package-scripts.json` remain unchanged. The owner applies both
updates together in the signed batch.

Add the coherence command to `test:code`, after the pinned version check and
before the Node suite; keep `npm test` itself unchanged:

```diff
-"test:code": "npm run test:secrets && node scripts/check-rule-copies.js && node scripts/check-versions.js && PATH=.venv/bin:$PATH node --test tests/*.test.js && npm test --prefix pi-extension && npm test --prefix rig-mcp",
+"test:code": "npm run test:secrets && node scripts/check-rule-copies.js && node scripts/check-versions.js && node scripts/check-coherence.js && PATH=.venv/bin:$PATH node --test tests/*.test.js && npm test --prefix pi-extension && npm test --prefix rig-mcp",
```

`tests/coherence.test.js` now runs the check directly, so the behavior is
covered before the owner applies the package-script pin amendment.
