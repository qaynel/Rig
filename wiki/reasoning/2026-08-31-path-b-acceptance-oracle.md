---
date: 2026-08-31
source: agent
topics: onboarding-flow, what-rig-is, testing-strategy, gate1-signing, specification-gate, delivery-plan
decisions:
status: historical
supersedes: 2026-08-31-path-b-oracle-checkpoint
tags: interdependency, trap
summary: Path B acceptance oracle authored — ten cases expand Gate 1 to 83; 55 direct checks produce 54 expected product failures and one green service-catalogue preservation guard; the exact 14-file manifest and evidence map await human review and signature, with implementation not begun.
---

# Path B acceptance oracle

## Standing

The intent owner's Path B product direction, follow-up decisions, and technical
design contain no unresolved decision. Grilling has transcribed them into ten
observable acceptance cases, one for each foundational and support contract,
and into tests at the source, installed-payload, domain, CLI, and MCP seams.
The amendment is complete as a proposal but is not frozen or authorized until
the human owner signs its exact bytes.

## Inference declaration for the signer

These criteria were inferred by the agent from the owner-locked Path B traces
and the exact external contracts in the completed technical design. In
particular, the oracle treats the design's schemas, marker grammar, command
shape, failure codes, family membership, ownership rules, and authority split
as intended observable behavior. That is why the tests are concrete rather
than prose checks. If any of those inferences overstates or misreads the
owner's intent, change or remove it before signing; the signature must not be a
blind approval of an agent-authored goalpost.

## Problem, outcome, and boundary

The user is a developer onboarding Rig into an existing repository through a
host agent. The outcome is an explicit agent-led graft: deterministic Rig code
supplies bounded facts and applies only approved bytes, while the host agent
owns semantic relevance, reuse, delta, graft, add, and omit judgment. The user
reviews the resulting improvement and consequential decisions, then approves
the exact proposal and eight-section summary.

In scope are the separate 63-skill shelf, marked graft ownership, pinned
catalogue context, strict `.rig/` state/reports, the shared four-action engine,
the one-command install handoff, structural inventory/overlap reports, one
router and playbook, and warning-only weight with hard correctness failures.
The governed 115-service catalogue stays untouched. Out of scope remain
installer inference, auto-triggering, agent-created approval, context
compression, unmarked edits, router re-evaluation, taxonomy unification, and
hard file/byte ceilings.

## Acceptance and executable evidence

| Contract | Case | Primary evidence | What independently fails before implementation |
| --- | --- | --- | --- |
| F-1 | `AT-PB-1` | `tests/path-b-catalog.test.js` | Exact 63-skill/eleven-family membership, recursive bounded metadata, aliases/names, and the untouched service-tree guard |
| F-2 | `AT-PB-2` | `tests/path-b-graft.test.js` | Exact versioned markers, outside-byte identity, CAS, malformed/link refusal, current-section journalling, and section-only uninstall |
| F-3 | `AT-PB-3` | `tests/path-b-catalog.test.js` | Deterministic digest-bound catalogue, one non-discoverable shelf, mandatory-only projection, offline prepare, drift and edited-copy conflict |
| F-4 | `AT-PB-4` | `tests/path-b-state.test.js` | Strict state/report schemas, summary binding, transitions, CAS revisions, invalidation, idempotency, and disk reconciliation |
| F-5 | `AT-PB-5` | `tests/path-b-onboarding.test.js`, `tests/path-b-mcp.test.js` | Mechanical prepare, agent proposal authority, critical-decision stop, exact approval binding, selective apply, resume, and domain/CLI/MCP parity |
| F-6 | `AT-PB-6` | `tests/path-b-install.test.js` | `install rig`, repeatable host mapping, early unknown-host refusal, runtime delivery, exact handoff, and no auto-onboarding |
| S-1 | `AT-PB-7` | `tests/path-b-inventory.test.js` | Known-root structural inventory, declared fields only, redaction/bounds, contained/escaping alias handling, and deterministic report bytes |
| S-2 | `AT-PB-8` | `tests/path-b-inventory.test.js` | Exact tags/aliases only, grouped set difference, no prefix/prose inference, and no selection or mutation side effect |
| S-3 | `AT-PB-9` | `tests/path-b-mcp.test.js` | One mandate and playbook across multi-host wrappers plus identical domain/MCP playbook bytes and resolvable pointers |
| S-4 | `AT-PB-10` | `tests/path-b-weight.test.js` | Warning-only file/byte growth, every named hard-failure code and non-success exit, plus legitimate staging/projection exceptions |

The tests drive actual source loaders, payload installation, repository files,
the shared domain request union, the installed executable, and MCP clients.
They do not pass by finding specification text or by reimplementing product
logic in a fixture.

## Red evidence

The focused pre-implementation run was:

```text
node --test --test-reporter=dot tests/path-b-*.test.js
exit 1 — 55 tests: 1 pass, 54 fail
```

Every ID from `AT-PB-1` through `AT-PB-10` has at least one failure. The one
green test is intentional: it hashes the governed `rig/catalog.json` plus all
805 service files and proves that the Path B oracle has not changed that
catalogue. The failures name missing Path B product behavior: no generated
skill catalogue/metadata, graft primitive, onboarding state/domain, canonical
installer, inventory/overlap writer, MCP tool/playbook projection, or
correctness/weight check exists yet.

## Oracle closure checks

- Gate 1 contains 83 active acceptance IDs.
- Gate 2 has exactly 83 trace rows and 83 named test targets.
- The manifested test sources expose exactly the same 83 title IDs.
- The sorted testing manifest contains 14 files and every listed SHA-256
  matches the current bytes.
- The Path B technical specification is present and remains the current
  approach. Only Gate 2's acceptance count and evidence map changed; its
  technical approach was not rewritten to suit the tests.
- No Path B runtime implementation, `rig/manifest.json`, or `SKILL.md` changed.

## Handoff

Rebuild the generated wiki indexes and run their focused check, then stop. The
next act is the mandatory human review and signature over the exact amended
oracle. No agent may run or simulate `node scripts/approve-gate1.js`, and no
TDD implementation begins before the signature succeeds.
