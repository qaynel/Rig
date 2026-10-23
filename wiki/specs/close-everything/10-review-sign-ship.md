# 10 — Security review, code review, the one signature, ship (D3, D4)

Part of the [master plan](00-master-plan.md). Runs last.

## Order

Before the final security/code reviews, prepare 6.0.0 versions, CHANGELOG,
translated docs, wiki and proposed tracker transitions. Preliminary subplan
reviews remain useful, but the binding receipt must describe the final bytes.

1. **Security review (D3).** A full review of the branch diff and of the install
   and unpack path. Particular focus:
   - agent-written projection scripts (03 §trust)
   - service checks that execute repo commands (04)
   - MCP server exposure
   - secret hygiene

   Every finding is fixed, or closed with a strong written reason.
2. **Code review (D4).** An independent `rig-code-review` pass over the full
   diff. Every finding is fixed or answered in writing.
3. **Coherence sweep and candidate transition check (08)** are green.
   Keep live open issues open until their fix reaches QA.
4. **The one signature.**
   - The owner reviews the unfreeze bundle: frozen-path updates from 03, the
     RIG-146 case, promoted RIG-125 properties, the catalogue contract
     (RIG-112), the RIG-113 cases, and any D1/D5/D7 acceptance the owner chooses
     to freeze, plus the package-script snapshot, acceptance-count verifier,
     manifest changes and matching technical-spec trace targets.
   - The owner applies the bundle and runs `node scripts/approve-gate1.js` once.
   - The agent never signs.
5. **Full gate:** after owner-applied amendments and signature, `npm test`
   is green locally on the final candidate bytes, with frozen cases green; the
   candidate install run also names this exact head/artifact digest.
6. **Final independent review evidence:** bind a fresh review receipt to that
   tested implementation digest and catalogue. Changes after this invalidate
   evidence and restart verification before review.
7. **PR** to `qa-prod`. CI is green, including `gate1-pin`.
8. **Deliver to QA:** merge the one PR after its required checks pass. Retain
   exact-head CI evidence and leave issue closure until publication.
9. **QA → prod and release (owner decision):** automated checks only.
   Require a green health/full-gate/coherence run and real-download clean-install
   evidence on the exact QA SHA. No manual outside-repository install gate.
   Promote that reviewed commit, create the version tag and publish
   its GitHub release only after exact-SHA candidate E2E/full-gate success.
   Verify the public tagged installer afterwards; do not count an old weekly
   run or bootstrap-only smoke test as release evidence.
10. **Tracker closure:** after the tag, release and public-download checks pass,
    close issues with delivered commit/test or redesign/backlog evidence and
    verify the final live tracker agreement.

## Acceptance

- Zero open review findings without a written disposition.
- `npm test`, `gate1-pin`, the E2E run, and the coherence check are all green on
  the PR head.
- No GitHub issue that was open on 2026-10-13 remains open, except any the
  owner explicitly reopens.
