---
date: 2026-08-20
source: agent
topics: the-catalogue, delivery-plan, authored-service-gate
decisions:
status: historical
---

Gathered current context for vertically deploying
`development.code-quality.lint-format` from the branch's current state to
production.

The production fork is closed. The intent-owner trace
`2026-08-20-vertical-lint-format-production.md` records the instruction to
continue by vertically deploying the linting leaf instead of waiting for
horizontal catalogue deployment. Gate 2 now carries that as `AD-31`: lint-format
is the first production leaf, and the remaining 114 leaves block only their own
support plus the complete-catalogue claim.

What is already true:

- The lint-format catalogue entry has service-specific metadata, a convention
  disposition, adjacent exclusions, source-code applicability, empty direct
  dependencies, cumulative check IDs, and acceptance evidence pointing at
  `tests/advanced-lint-format.test.js`.
- Its seven fragment files are authored and contain no `TODO(Slice 10)`,
  `TBD`, `Razor-scoped dependency slice`, or generic convention filler.
- The implementation discovers repository-owned `package.json` scripts instead
  of installing a formatter or linter. Checks run argv arrays with `shell:
  false`; maximal records an explicit fix argv but checks and CI do not dispatch
  it.
- The focused test command
  `node --test tests/advanced-lint-format.test.js tests/advanced-apply.test.js`
  passed: 15 tests, 15 pass, 0 fail. It exercises authored-content rejection,
  clean and broken formatter/linter checks, maximal CI plus explicit fix,
  missing formatter coverage gaps, and interrupted apply resume.
- The lint-format subtree itself has no `TODO(Slice 10)` matches. The rest of
  the catalogue still has 428 placeholder files, which remain valid blockers for
  those leaves and the complete-catalogue claim, not for lint-format's first-leaf
  production path under `AD-31`.

What still blocks claiming lint-format support:

1. Gate 2 is still a failed candidate, not frozen. The round-3 blocker is fixed,
   but the three remaining findings are still open: AD-30/§8.4 vs D19,
   §1/`AT-BASE-2` vs §11.1/AD-26, and §8.8 vs `AT-SECRET-1`. A fresh round-4
   review has not run.
2. Gate 1 signature is still unarmed. No `gate1.sig` or
   `gate1.allowed-signers` exists. The intent owner must sign; an agent cannot
   do this step.
3. The executable specification gate still does not exist, and `npm run
   test:code` is not wired. `npm test` therefore remains an unreliable
   production gate.
4. The authored-service gate itself does not exist yet. The focused lint-format
   test is good evidence, but it is not the exact-digest mechanical plus
   semantic/MECE leaf review required by `AT-SHAPE-6` and `AD-31`.
5. The apply path has the minimal manifest/resume behavior the probe needed, but
   not the complete §7.6 contract: preimage content-addressed storage, the
   `complete: false` header, and reverse-walk removal are still unbuilt.
6. Distribution is absent: no root `install.sh`, package version remains
   `4.8.4`, and no released-tag install proof exists.
7. No fresh exact-digest lint-format leaf review receipt exists under
   `wiki/sources/reviews/`.

Therefore the next deployable sequence is:

1. Resolve the three remaining Gate 2 review findings.
2. Run a fresh Gate 2 review at the final bytes and freeze Gate 2 if clean.
3. Have the intent owner arm/sign Gate 1 once the verifier exists.
4. Build the executable spec gate and `npm run test:code`.
5. Build the authored-service gate enough to evaluate lint-format exactly,
   including the per-leaf exact-digest semantic/MECE receipt.
6. Complete §7.6 manifest/resume/removal for the write paths lint-format uses.
7. Add distribution and released-tag install proof.
8. Run the focused lint-format checks, authored-service gate, distribution test,
   and full production gate before claiming lint-format support.
