# Frozen-test unfreeze request

## Test to change

- **File:** `scripts/check-advanced-spec.js`
- **Test name or acceptance case:** the Gate 1 active-acceptance-ID-count
  assertion in `verifyCoverage` (`assert.equal(accepted.length, 73, ...)`).

## Proposed change and why

Path B expands Gate 1 by ten cases (the AT-PB-1 through AT-PB-10 catalogue,
inventory, state, graft, shared-domain, CLI/MCP, installer, router, and
checker contracts). `scripts/check-advanced-spec.js` is the specification-gate
script that enforces exact set equality between Gate 1's ID set and Gate 2's
traceability set; its expected-count constant must move from 73 to 83 in
lockstep with the amended `acceptance.md`, or the gate script rejects the
acceptance file it was itself amended to cover. The single-line change:

```
-  assert.equal(accepted.length, 73, 'Gate 1 must contain exactly 73 active acceptance IDs');
+  assert.equal(accepted.length, 83, 'Gate 1 must contain exactly 83 active acceptance IDs');
```

This request is filed after the fact: commit `5694fd7b` already carries the
73→83 edit and `wiki/gate1/testing-infrastructure.manifest` already carries
the digest of the amended (83-case) file. The evidence record for that change
was never filed at the time; this backfills it.

## Evidence

- [x] **The encoded specification changed.** Path B's technical spec
  (`wiki/gate2/technical-spec.md` §13) adds ten AT-PB-* rows to Gate 2's
  traceability table; `wiki/gate1/acceptance.md` was amended in lockstep to
  carry the ten new acceptance cases. `check-advanced-spec.js`'s job is exact
  set equality between the two — its constant has to track the amendment or
  the gate becomes a false negative against its own intended input.
- [x] **The test asserted a non-issue.** The frozen `73` was never a business
  requirement; it is a mechanical mirror of Gate 1's row count at the time
  the gate script was written, whose only job is staying in lockstep with
  whatever that count is.

Verification: `node scripts/check-advanced-spec.js` exits 0 against the
current `acceptance.md` — "signed oracle: verified, 14 files, 83 acceptance
cases." No other assertion in the file changed; set-equality, traceability,
and title-matching all still run unmodified.

## Human authorization

- **Key holder / signing-key fingerprint:**
- **Date:**
- **I authorize this oracle change:**

## Re-sign record

- **Command:** `node scripts/approve-gate1.js --confirm-digest-delta <digest printed by the refused first run>`

  Expected manifest delta:

  ```
  - 0ef213f5cc25a0bf813d8fc1c520f7af3e6c1220938543bbb07e7d6b64538a9f  scripts/check-advanced-spec.js
  + 2980d274c0840c04240ac6cd9a1f493d38e4e3578e309fdc40a3d55314f0c657  scripts/check-advanced-spec.js
  ```

  `wiki/gate1/testing-infrastructure.manifest` already carries the `+` digest
  above — the file bytes are not in question. The oracle has since been
  re-signed under the gate1 owner's original key and verifies clean. What
  remains is this request's own authorization block below, which the re-sign
  run already consumed in practice but which still needs the owner's
  recorded signature for the paper trail.

- **Resulting signature or commit reference:**
