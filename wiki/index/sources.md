# Sources index

Every file under `sources/`, one place to find it from. `sources/` itself is
held as written — a verbatim log, a captured piece of outside research, a
review receipt, or a design this project has since moved past — so this index
lives here instead, alongside the wiki's other flat lookups, and is rewritten
freely as the underlying files are added or archived. When a topic's synthesis
and a source disagree, the source wins and the topic is what's wrong.

## Logs — verbatim decision history

- [`../sources/logs/grill-decisions.md`](../sources/logs/grill-decisions.md) —
  the foundational grill session, 2026-07-16: deltas against the original
  harness design doc, entries `G1`–`G10`.
- [`../sources/logs/advanced-grilling.md`](../sources/logs/advanced-grilling.md)
  — the Tier 2 Advanced grilling that follows it, `GA-#`, starting 2026-07-21.

## Reference — captured outside research

- [`host-ci-capability-verification.raw.md`](../sources/reference/host-ci-capability-verification.raw.md)
  — per-host/per-CI-provider capability verification (Instruction Graft, Native
  Skill Wrapper, Live Hooks, Native MCP Config), dated 2026-07-24.
- [`host-config-surfaces-verification.raw.md`](../sources/reference/host-config-surfaces-verification.raw.md)
  — per-host config surface verification, repo-scoped vs. user-global.
- [`agent-harness-security-playbook.raw.md`](../sources/reference/agent-harness-security-playbook.raw.md)
  — agent-tech safety baseline research.
- [`product-security-taxonomy.raw.md`](../sources/reference/product-security-taxonomy.raw.md)
  — the product-security family taxonomy behind the catalogue's Product-Security
  axis.
- [`mutation-testing-taxonomy.raw.md`](../sources/reference/mutation-testing-taxonomy.raw.md)
  — mutation-testing tool taxonomy (`GA-4b`).
- [`testing-pipeline-vision.raw.md`](../sources/reference/testing-pipeline-vision.raw.md)
  — the staged testing-pipeline vision behind the testing-strategy topic.

## Reviews — receipts

- [`../sources/reviews/`](../sources/reviews/) — dated JSON review receipts for
  Gate 2 rounds and the à-la-carte implementation pass, each bound to the
  digest it reviewed. Held as data, not prose; cited from the topic hub the
  round affected.
- [`rig-120-v5.0.0-2026-08-29-fresh.codex.failed.review.json`](../sources/reviews/rig-120-v5.0.0-2026-08-29-fresh.codex.failed.review.json)
  — non-binding fresh Codex fallback review after the requested Opus backend
  hit its local session limit; failed on the frozen-vs-CI authority split.
- [`rig-120-v5.0.0-2026-08-29-fresh.review.json`](../sources/reviews/rig-120-v5.0.0-2026-08-29-fresh.review.json)
  — passing independent review bound to the `v5.0.0` tagged commit.

## Superseded — designs this project moved past

- [`rig-foundational-design.md`](../sources/superseded/foundational/rig-foundational-design.md)
  — the original 2026-07-15 plan doc the first grill session worked from,
  before the product had the name Rig.
- [`tier-1-mvp-design.md`](../sources/superseded/tier-1-design-docs/tier-1-mvp-design.md)
  — the 2026-07-16 Tier 1 MVP design exported from that grill session.
- [`deprecated-tier-taxonomy/README.md`](../archive/deprecated-tier-taxonomy/README.md)
  — the retired Basic / mid / Advanced tier packaging (archived 2026-07-24,
  `GA-9g`), replaced by the mandatory safety baseline plus the à-la-carte
  catalogue.
  - [`tier-2-design.md`](../archive/deprecated-tier-taxonomy/tier-2-design.md)
    — the superseded Tier 2 Basic-vs-Advanced package split.
  - [`basic/basic-design.md`](../archive/deprecated-tier-taxonomy/basic/basic-design.md)
    — the archived Basic design: the credentialed multi-host MCP configurator.
  - [`basic/basic-implementation-plan.md`](../archive/deprecated-tier-taxonomy/basic/basic-implementation-plan.md)
    — its task-by-task build plan.
  - [`basic/basic-test-plan.md`](../archive/deprecated-tier-taxonomy/basic/basic-test-plan.md)
    — the verification plan grounded in the `tests/basic-*.test.js` suite.
  - [`basic/first-wire-caveats.md`](../archive/deprecated-tier-taxonomy/basic/first-wire-caveats.md)
    — open first-wire questions the Basic design left for OpenClaw and CodeWhale.

Do not treat anything under `superseded/` as current intent — each file there
either says so at the top or is indexed from a README that does.
