---
date: 2026-08-20
source: agent
topics: the-catalogue, delivery-plan, authored-service-gate
decisions:
status: historical
---

**Verdict:** production development should not start yet. The proposed vertical release contradicts the frozen business contract, which still says all 115 catalogue leaves block release.

**Undocumented Decisions**
1. **Release boundary:** Can lint/format ship while the other 114 leaves remain placeholders? Gate 1 currently says no; the draft PR says yes.
2. **Release contents:** Is this full Rig with the mandatory safety baseline and one catalogue leaf, or a limited preview?
3. **Host coverage:** Must the first lint/format release support all 19 hosts and six CI providers, as currently required?
4. **Product promise:** Rig currently adapts existing commands; it does not create, choose, or install a formatter or linter. Confirm that this is the intended product.
5. **Ecosystem scope:** Root npm project only, or also pnpm, Yarn, Bun, Python, Go, Rust, Java, and other ecosystems?
6. **Repository layouts:** Root package only, or workspaces, monorepos, nested packages, and polyglot repositories?
7. **Command discovery:** Are the exact script names `format:check`, `lint`, `format`, and `lint:fix` the supported contract, or should Rig discover aliases/tools?
8. **Grade meaning:** Is minimal formatter-only, mid formatter plus lint, and maximal CI plus one fix command the intended customer-facing progression?
9. **Applicability:** Should a repository without supported commands be installable with a permanent coverage gap, or should Rig refuse/recommend against installation?
10. **Execution consent:** Selecting the service causes repository-controlled package scripts to execute. Is selection itself sufficient consent?
11. **Shell trust:** `npm run` can execute shell content even when Rig launches npm with `shell: false`. The current safety wording does not acknowledge this.
12. **Read-only guarantee:** What must happen if a supposed check mutates files: detect and fail, restore changes, or merely report them?
13. **Check scope:** Define repository-wide versus changed-file behavior, invocation timing, ignored/generated files, and working directory.
14. **Autofix:** Define how the user invokes it, whether both lint and format fixes are supported, approval requirements, post-fix verification, and ownership of source changes.
15. **CI behavior:** Define provider selection, behavior when CI is absent or unsupported, existing-pipeline conflicts, and whether maximal can create a pipeline.
16. **Command drift:** Decide whether changed package scripts are automatically rediscovered or treated as stale/tampered bindings.
17. **Output privacy:** Linter output may contain source or secrets. Logging, reports, CI output, redaction, and agent-context exposure are unspecified.
18. **Failure semantics:** Timeouts, cancellation, missing dependencies, signals, partial output, and command-not-found behavior lack acceptance examples.
19. **Lifecycle:** Clarify reinstall, legacy-install coexistence, removal of generated CI/configuration, and whether user-invoked autofix changes survive uninstall.
20. **Support claim:** Define the exact observable threshold for saying “lint/format is production-supported.”

**Unverified Blockers**
1. Three existing technical-spec findings remain unresolved: recovery-key trust claims, conflicting host terminology, and the missing safe data path for model-assisted secret triage.
2. The technical specification changed after its failed review; no fresh review has passed and it is not frozen.
3. There are no independent, frozen lint/format acceptance cases. Current tests were produced with the implementation and cover only a root npm fixture.
4. The service is labelled “convention-only” while it executes real commands, conflicting with the executable-first business rule.
5. The authored-service anti-placeholder and semantic review gate does not exist.
6. No exact-digest independent review of the lint/format leaf exists.
7. The mandatory safety baseline is not production-proven.
8. Complete host and CI byte-emission coverage is not proven.
9. Install resume/removal is partial: preimage storage, explicit incomplete state, reverse uninstall, and clean-removal proof remain absent.
10. Distribution is absent: no production installer, release tag proof, or production version.
11. Gate 1 signing is not armed.
12. The executable specification gate is absent, so the green suite cannot validate specification completeness.
13. Edge cases such as monorepos, alternative package managers, mutating/malicious scripts, timeouts, missing CI, existing CI conflicts, and interrupted uninstall are untested.
14. The current draft PR targets the advanced-development branch rather than `qa-prod` and contains only the release-strategy documentation.

**Recommendation:** first amend and re-freeze Gate 1 so the release contract explicitly permits **full safety baseline + complete required host/CI coverage + lint/format as the only supported catalogue leaf**, while the other leaves block only their own support and the “complete catalogue” claim.

First decision: should that be the production boundary, or should this be labelled a non-production preview until all 115 leaves are complete?
