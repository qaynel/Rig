---
date: 2026-08-31
source: agent
topics: onboarding-flow, what-rig-is
decisions:
status: current
supersedes:
tags: interdependency
summary: Technical spec for the Path B locked direction — F-1..F-6 + S-1..S-4.
---

# Path B — agent-led adaptive onboarding technical specification

## 0. Standing and boundary

This is the working technical design for the already-locked Path B product
direction. It defines how the host agent receives repository and Rig context,
calculates the delta, proposes the smallest useful graft, obtains content-bound
approval, applies only marked or Rig-owned writes, and proves the result. It is
checked for presence with the oracle; it is not frozen and may adapt during
implementation while the signed intent and acceptance tests remain unchanged.

The following are invariants, not design choices:

- Rig code performs mechanical discovery, validation, rendering, journalling,
  and checking. It never infers what a repository wants from repository shape.
- The onboarding host agent owns relevance, reuse, delta, and graft judgment.
- The governed 115-service catalogue remains `family → group → service →
  grade`. The skill-shelf taxonomy in this design is separate.
- A repository-owned file is changed only inside an explicit Rig graft section,
  with a preimage and content-bound approval. Content outside that section is
  authoritative.
- File and byte growth can warn but cannot fail. Duplicate writes, malformed
  ownership boundaries, dangling installed references, and other known
  correctness regressions fail.
- Onboarding never auto-runs. Installation ends by telling the user to invoke
  `rig-onboarding` in a host agent.
- Context compression, unmarked repository-file edits, router re-evaluation,
  and taxonomy unification are outside this design.

## 1. Current-state trace and chosen shape

The current install has the right low-level primitives but no adaptive loop:

- `collectHarnessFiles` finds bounded known harness paths, hashes and scans
  their bytes, but emits no structural inventory and no capability tags.
- `profileRepo` derives four advisory application-shape signals. Those signals
  continue to serve only the governed service menu and never select skills.
- `resolve` turns explicit service selections into the existing `rig.json`
  service/dependency shape. Path B does not add skill taxonomy fields to that
  file.
- `installVendoredSkillsOp` enumerates 55 vendored skills and projects every one
  into every selected discovery tree. The seven core workflow skills are copied
  separately, so the current callable source inventory is 62, not the older
  approximate 64. Path B adds `rig-onboarding`, making 63.
- `rewriteSkillName` already handles host prefixes and the `rig` self-prefix
  collision. The new index keeps canonical names independent of source vendor.
- `journalWriter` already records pending/applied writes and preimages. It is
  extended for a set of graft sections per path; it is not replaced.
- `.rig/routing.md` is already the shared router, while host files are adapters.
  Path B makes that single-source rule explicit and adds the onboarding route.

The resulting data flow is:

```text
install rig
  → install core workflow + runtime skill library + capability catalogue
  → user explicitly invokes rig-onboarding
  → prepare: bounded inventory + mechanical overlap surface
  → host agent reads repository + catalogue and calculates the delta
  → host agent resolves routine choices and escalates critical ones
  → propose: canonical proposal + summary, no repository-owned mutation
  → user-presence approval bound to the exact proposal and summary
  → apply: selected skill projections + marked grafts + state ledger
  → check: correctness failures + weight warnings
  → concise success response
```

One domain function, `handleOnboarding(request)`, owns the four executable
actions (`prepare`, `propose`, `apply`, `check`). The installed CLI and the MCP
tool are thin adapters over it. The skill owns the semantic playbook; neither
adapter reimplements agent judgment.

### Authority split

| Concern | Owner |
|---|---|
| Enumerate known files, parse bounded structure, hash, redact | Rig code |
| Describe Rig skills, tools, guarantees, and overlap tags | Release catalogue |
| Decide relevant families/capabilities | Host agent |
| Decide reuse, graft, add, or omit | Host agent |
| Decide whether a choice meets the critical predicate | Host agent |
| Resolve a critical choice and approve the final proposal | User through verified presence |
| Validate paths, markers, digests, approval, and state transitions | Rig code |
| Write selected projections, marked sections, and `.rig/` state | Rig code |
| Verify duplicates, references, ownership, state completeness, files, bytes | Rig code |

## 2. Cross-cutting data and safety rules

All JSON schemas in this design use `schema_version: 1`, UTF-8, LF on write,
two-space indentation, and one trailing newline. Unknown keys fail validation
on mutation inputs. Paths are repository-relative POSIX paths; absolute paths,
empty segments, `.`/`..`, NUL, escaping symlinks, and multiply linked mutation
targets are rejected through the existing containment seam.

All content-bound digests are lowercase SHA-256 hex. Objects are digested from
canonical JSON: object keys sorted recursively; arrays kept in their declared
semantic order; no insignificant whitespace; UTF-8 bytes. Lists whose schema
declares order irrelevant are sorted before canonicalisation. This needs one
small standard-library helper, not a dependency.

Apply uses one exclusive `.rig/onboarding.lock`. It records PID and start time,
is never auto-broken, and is removed in `finally`. Every repository mutation is
preflighted before the first write. Every write then uses the existing
pending/applied journal protocol. A mid-apply failure keeps completed writes,
does not claim success, and resumes on an identical approved proposal. A changed
proposal requires new approval.

The existing plan-approval receipt is reused:

```json
{
  "schema_version": 1,
  "kind": "plan-approval",
  "plan_digest": "<onboarding proposal digest>",
  "approval": {
    "method": "host-native | external-sshsig",
    "verified": true
  }
}
```

The proposal digest includes the catalogue digest, inventory digest, every
capability disposition, every selected skill, every graft preimage/content
digest, every resolved critical decision, and the onboarding-summary digest.
The tool verifies approval; it never prompts, signs, or fabricates a receipt.

## 3. F-1 — skill-shelf family reorganisation

### 3.1 Scope and taxonomy doctrine

The source shelf has two inputs:

- 55 optional vendored skills returned by `listVendoredSkills()`;
- 7 mandatory core phase skills (grilling, product design, implementation,
  execution, TDD, debugging, code review).

`rig-onboarding` becomes the eighth mandatory core skill in F-5. The generator
therefore sees 62 entries before F-5 and 63 after it. Counts are release
snapshots, not eternal constants: a catalogue edit intentionally updates the
snapshot and generated digest.

The initial doctrine-owned family IDs are:

| Family ID | Boundary |
|---|---|
| `requirements` | Intent discovery, grilling, and question calibration |
| `specification-and-planning` | Executable specifications and plan interrogation |
| `implementation-and-orchestration` | Minimal implementation, routing, delegation, and coordinated execution |
| `testing` | TDD, QA, evaluation, and performance regression testing |
| `review` | Independent code, pull-request, health, and developer-experience review |
| `debugging` | Root-cause diagnosis and bounded repair |
| `safety-and-security` | Destructive-action controls, edit boundaries, and security review |
| `design-and-experience` | Product/UI design generation and visual evaluation |
| `knowledge-and-documentation` | Context handoff, project memory, documentation, and retrospectives |
| `browser-and-research` | Browser operation, authenticated sessions, extraction, and remote pairing |
| `delivery-and-operations` | Shipping, deployment, post-deploy observation, upgrades, and platform maintenance |

Adding, removing, renaming, splitting, or merging a family changes doctrine and
returns to grilling. Moving a skill between existing families or capabilities
is a catalogue edit reviewed like any other metadata change.

### 3.2 Complete initial membership

The middle level is `capability`; `tool` is an orthogonal primary execution
substrate recorded on each skill. A skill has exactly one primary family and
capability even when its overlap tags span adjacent concepts.

| Family | Capability | Skills |
|---|---|---|
| requirements | `requirements.intent-discovery` | `rig-grilling`, `office-hours` |
| requirements | `requirements.question-calibration` | `plan-tune` |
| specification-and-planning | `specification-and-planning.executable-specification` | `rig-product-design`, `spec` |
| specification-and-planning | `specification-and-planning.multi-perspective-plan-review` | `autoplan`, `plan-ceo-review`, `plan-design-review`, `plan-devex-review`, `plan-eng-review` |
| implementation-and-orchestration | `implementation-and-orchestration.minimal-change` | `rig-implementation` |
| implementation-and-orchestration | `implementation-and-orchestration.coordinated-execution` | `rig-execution` |
| implementation-and-orchestration | `implementation-and-orchestration.workflow-routing` | `rig` |
| implementation-and-orchestration | `implementation-and-orchestration.delegated-coding` | `codex` |
| implementation-and-orchestration | `implementation-and-orchestration.skill-authoring` | `skillify` |
| testing | `testing.test-driven-development` | `rig-tdd` |
| testing | `testing.web-quality-assurance` | `qa`, `qa-only` |
| testing | `testing.performance-regression` | `benchmark` |
| testing | `testing.agent-evaluation` | `benchmark-models` |
| testing | `testing.ios-quality-assurance` | `ios-qa` |
| review | `review.code-and-pull-request` | `rig-code-review`, `review` |
| review | `review.code-health` | `health` |
| review | `review.developer-experience` | `devex-review` |
| debugging | `debugging.root-cause-analysis` | `rig-debugging`, `investigate` |
| debugging | `debugging.ios-repair` | `ios-fix` |
| safety-and-security | `safety-and-security.destructive-action-guard` | `careful` |
| safety-and-security | `safety-and-security.edit-scope-control` | `freeze`, `guard`, `unfreeze` |
| safety-and-security | `safety-and-security.security-review` | `cso` |
| design-and-experience | `design-and-experience.design-consultation` | `design-consultation` |
| design-and-experience | `design-and-experience.design-exploration` | `design-shotgun` |
| design-and-experience | `design-and-experience.interface-production` | `design-html` |
| design-and-experience | `design-and-experience.visual-review` | `design-review` |
| design-and-experience | `design-and-experience.ios-visual-review` | `ios-design-review` |
| knowledge-and-documentation | `knowledge-and-documentation.context-handoff` | `context-save`, `context-restore` |
| knowledge-and-documentation | `knowledge-and-documentation.project-memory` | `learn`, `setup-brain`, `sync-brain` |
| knowledge-and-documentation | `knowledge-and-documentation.documentation` | `document-generate`, `document-release` |
| knowledge-and-documentation | `knowledge-and-documentation.technical-diagrams` | `diagram` |
| knowledge-and-documentation | `knowledge-and-documentation.document-publishing` | `make-pdf` |
| knowledge-and-documentation | `knowledge-and-documentation.retrospective` | `retro` |
| browser-and-research | `browser-and-research.browser-automation` | `browse` |
| browser-and-research | `browser-and-research.browser-session` | `open-rig-browser`, `connect-chrome` |
| browser-and-research | `browser-and-research.remote-pairing` | `pair-agent` |
| browser-and-research | `browser-and-research.web-extraction` | `scrape` |
| browser-and-research | `browser-and-research.authenticated-session` | `setup-browser-cookies` |
| delivery-and-operations | `delivery-and-operations.deploy-configuration` | `setup-deploy` |
| delivery-and-operations | `delivery-and-operations.land-and-deploy` | `land-and-deploy` |
| delivery-and-operations | `delivery-and-operations.post-deploy-canary` | `canary` |
| delivery-and-operations | `delivery-and-operations.release-shipping` | `ship` |
| delivery-and-operations | `delivery-and-operations.release-queue` | `landing-report` |
| delivery-and-operations | `delivery-and-operations.rig-upgrade` | `rig-upgrade` |
| delivery-and-operations | `delivery-and-operations.ios-debug-instrumentation` | `ios-clean`, `ios-sync` |

F-5 adds `rig-onboarding` under
`implementation-and-orchestration.adaptive-onboarding`.

### 3.3 Frontmatter contract

Every canonical source `SKILL.md` in the 62-entry scope (63 after F-5) keeps
its existing `name` and `description` and gains these required fields:

```yaml
family: testing
tool: host-agent
capability: testing.test-driven-development
guarantees:
  - Drives one observable behaviour through red, green, and refactor.
  - Does not weaken the approved oracle.
overlap_tags:
  - test-driven-development
  - tdd
```

Validation is exact:

- `family` is one family ID above.
- `tool` is one lowercase kebab-case primary substrate ID, such as
  `host-agent`, `rig-browser`, `brain`, `codex-cli`, `ios-debug-bridge`, or
  `release-tooling`. It describes execution, not vendor provenance.
- `capability` matches
  `^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$`, its first
  segment equals `family`, and it is listed in the membership table.
- `guarantees` is a non-empty sequence of unique, one-line observable claims;
  each is at most 160 Unicode code points. It must describe what the skill
  preserves or proves, not marketing intent.
- `overlap_tags` is a non-empty, sorted, unique sequence matching
  `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Tags are comparison hints, never authority to
  install, omit, or modify anything.
- `name` remains globally unique after the existing collision tie-break.

The parser supports only these bounded scalar and block-sequence shapes. It
does not add a YAML dependency.

### 3.4 Source layout, projections, and generated index

The canonical optional shelf moves from a flat directory to:

```text
rig/catalog/skills/<family>/<capability-leaf>/<source-dir>/SKILL.md
```

Core phase skills keep their established source paths and join the index by
frontmatter. `listVendoredSkills` becomes recursive and returns
`{ name, dir, source_rel, family, tool, capability, guarantees,
overlap_tags }`. Source hierarchy never dictates the invocation name.

Native host discovery remains flat for compatibility:

```text
.claude/skills/<installed-name>/SKILL.md
.agents/skills/<installed-name>/SKILL.md
.rig/skills/<canonical-name>/SKILL.md   # instruction-only hosts only
```

The complete optional shelf is retained once, outside every discovery path,
under `.rig/runtime/rig/catalog/skills/`. It is the release-pinned material
source for a later approved selective projection. Only the compact catalogue
is supplied as agent context by default. Staging is counted in weight metrics
but is not a duplicate capability because no host discovers it there.

One generator reads the frontmatter and emits
`rig/catalog/skills/catalog.json`; the payload copies those exact bytes to
`.rig/catalog.json`. A check mode regenerates in memory and fails on drift.
There is no second handwritten capability index.

Family titles/descriptions live in the bounded generator input
`rig/catalog/skills/families.json`:

```json
{
  "schema_version": 1,
  "families": [
    { "id": "testing", "title": "Testing", "description": "<boundary>" }
  ]
}
```

Rows are unique and sorted by ID, and their IDs must equal the doctrine list in
this section. This keeps doctrine reviewable as data instead of hiding it in a
generator implementation.

### 3.5 Vendor-prefix migration

Origin labels never choose family membership. Migration follows these rules:

1. Inventory every canonical source and preserve its current callable `name`.
2. Assign family/capability/tool/guarantees/tags by what the skill does.
3. Move its source directory to the capability hierarchy; do not rename it
   merely to remove `superpowers:`, `mattpocock-skills:`,
   `pr-review-toolkit:`, `gstack:`, `chrome-devtools-mcp:`, or another origin.
4. Record any deliberate callable rename in a small generated-input file,
   `rig/catalog/skills/migrations.json`, shaped as
   `{ "schema_version": 1, "aliases": { "<legacy-name>": "<canonical-name>" } }`.
   Alias targets must exist and aliases must be unique.
5. The inventory/overlap writer may use only this exact alias table or
   self-declared capability metadata. It never strips an unknown prefix and
   guesses.
6. Projections write only the canonical name. Native wrappers may mention an
   alias for one release, but aliases never create a second skill directory.
7. Re-run removes an obsolete Rig-owned projection only when the prior journal
   proves ownership. It never renames or deletes a repository's third-party
   skill.

The existing `connect-chrome` source directory and `open-rig-browser` source
directory both declare `name: open-rig-browser`. The migration makes the former
declare its already-effective tie-break name, `connect-chrome`, so canonical
frontmatter is unique; both remain separate skills in the same browser-session
capability. No generic collision is silently renamed by the generator.

The current vendored shelf is a modified gstack import whose callable names
were already renamed. That provenance remains in its notice; it does not become
the hierarchy.

### 3.6 Seams, dependencies, verification

Touched later: `rig/lib/skills.js`, `rig/lib/payload.js`, the canonical skill
sources and mirror-generation checks, the new generator, and manifest entries
for the generated catalogue/runtime library. The 115-service catalogue loader,
schema, and files are untouched.

F-1 precedes F-3 and S-2. Verify with a catalogue test that snapshots all 62
current names and all membership rows, rejects missing/invalid metadata,
proves recursive enumeration, proves aliases do not create duplicate
projections, proves every mirror retains metadata after name rewriting, and
asserts no governed-service catalogue byte changes.

## 4. F-2 — graft-section marker convention

### 4.1 Version-1 grammar

Version 1 is intentionally limited to UTF-8 Markdown-compatible instruction
surfaces (`.md`, `.mdx`, `.mdc`, and extensionless files explicitly classified
as Markdown instruction files). JSON, YAML, TOML, source code, and unknown
formats are not rewritten by this helper. The agent uses a Rig-owned sidecar
and an existing supported pointer surface instead. Adding another comment
grammar is a later explicit design change; unmarked edits remain deferred.

The exact markers are whole lines:

```markdown
<!-- rig:graft capability="testing.test-driven-development" version="1" begin -->

Rig-managed content.

<!-- rig:graft capability="testing.test-driven-development" end -->
```

The parser accepts LF or CRLF input and preserves the file's existing newline
style. The formal open and close patterns are:

```text
^<!-- rig:graft capability="([a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+)" version="(1)" begin -->$
^<!-- rig:graft capability="\1" end -->$
```

Rules:

- Open and close capability IDs must match exactly.
- One file may carry several capabilities, but at most one section per
  capability.
- Sections cannot nest. A body cannot contain `<!-- rig:graft`.
- Unknown versions, orphan markers, duplicates, mismatched pairs, invalid
  UTF-8, and unsupported file types fail unchanged.
- The owned byte range begins at the open marker's first byte and ends after
  the close marker's line ending. No surrounding byte is normalised.
- Create appends one separator newline only when required. Update replaces
  only the owned byte range. Remove deletes only that range and the single
  separator newline that create introduced.

`version="1"` versions marker grammar, not the capability or its content.
Content changes keep version 1.

### 4.2 Ownership classes

| Class | Rule |
|---|---|
| Rig-owned | A path under `.rig/`, or another path created by Rig and proven by the journal. Whole-file replace/remove is allowed only with digest checks. |
| Repo-owned | A pre-existing path not proven Rig-owned. Only a versioned graft section may change. Outside bytes are authoritative. |
| Adopted legacy | A byte-identical prior Rig payload. Code may journal adoption, then treat it as Rig-owned. |
| Unknown/conflicting | Missing ownership evidence, malformed marker, unsupported format, symlink/hard-link ambiguity, or stale preimage. Fail unchanged. |

### 4.3 Payload helper contract

`payload.js` gains three exported operations backed by one parser:

```js
parseGraftSections(source) -> {
  newline,
  sections: [{ capability, version, start, end, content, content_digest }]
}

upsertGraftSection(target, {
  path, capability, version: 1, content, expected_file_digest
}, writeFile) -> { changed, action: 'create'|'update'|'noop', file_digest }

removeGraftSection(target, {
  path, capability, expected_file_digest
}, writeFile) -> { changed, action: 'remove'|'noop', file_digest|null }
```

Both mutation helpers canonicalise `content` to no leading/trailing blank line
inside the envelope, reject marker text in content, compare-and-swap the whole
file against `expected_file_digest`, and pass the final bytes through
`journalWriter`. A missing target is allowed only for `upsert` and becomes a
Rig-created file; `remove` on a missing target is idempotent only when state
already records the section absent.

The latest journal record for a grafted path uses:

```json
{
  "ownership": "graft_managed",
  "operation": "graft_managed",
  "managed_grafts": [
    {
      "capability": "testing.test-driven-development",
      "version": 1,
      "content_digest": "<sha256>"
    }
  ]
}
```

`managed_grafts` describes every Rig section currently present in that path,
not only the section changed by the last call. This is required because the
current journal collapses to the latest record per path; recording one section
per record would strand earlier sections during uninstall.

Uninstall and Path B re-run parse the file and remove only capabilities listed
in the latest record. A well-formed matching marker remains removable even if
the user edited its body, because the marker explicitly declares Rig ownership;
the body digest difference is reported. Any malformed boundary is best-effort
failure and leaves the whole file unchanged. Whole-preimage restoration is not
used for graft removal because it would overwrite later repo-owned edits.

### 4.4 Seams, dependencies, verification

Touched later: `rig/lib/payload.js`; `rig/lib/lifecycle.js` for
`graft_managed`; the existing `graft.js` helper is either reduced to this
parser or removed after all callers migrate; plan/apply state records carry
preimages and section metadata.

F-2 can be built independently but F-5 consumes it. Tests cover create,
idempotent reapply, update, one-of-many removal, clean uninstall, CRLF
preservation, no-final-newline preservation, outside-byte identity, stale
preimage, malformed/nested/duplicate markers, unknown version, unsupported
format, symlink/hard-link rejection, edited managed body, and interrupted
journal resume.

## 5. F-3 — capability-catalog context surface

### 5.1 Location and schema

The generated release artefact is installed at `.rig/catalog.json` on every
Path B install. It is Rig-owned, release-pinned, and the only machine-readable
skill capability index supplied to onboarding. It never contains or imports
the governed service catalogue.

```json
{
  "schema_version": 1,
  "catalog_kind": "skill-shelf",
  "release": {
    "version": "<release tag>",
    "skills_digest": "<sha256 of canonical metadata rows>"
  },
  "taxonomy": {
    "id": "skill-shelf-v1",
    "families": [
      {
        "id": "testing",
        "title": "Testing",
        "description": "TDD, QA, evaluation, and performance regression testing."
      }
    ]
  },
  "skills": [
    {
      "id": "rig-tdd",
      "name": "rig-tdd",
      "description": "<existing frontmatter description>",
      "family": "testing",
      "tool": "host-agent",
      "capability": "testing.test-driven-development",
      "guarantees": ["<observable claim>"],
      "overlap_tags": ["test-driven-development", "tdd"],
      "aliases": [],
      "source_kind": "core",
      "required": true,
      "source_rel": "rig/tier-1/skills/tdd/SKILL.md"
    }
  ],
  "soft_budget": {
    "basis": "previous-release",
    "files": 0,
    "bytes": 0
  }
}
```

Arrays are sorted: families by ID, skills by `(family, capability, id)`, tags
and aliases lexically. `aliases` comes only from the explicit migration map.
`required` is true for the core workflow and onboarding skills, false for the
55 optional vendored skills. `soft_budget` is zero only when no previous
release measurement exists; zero disables growth warnings but not reporting.

The onboarding agent reads exactly: family definitions; skill name and
description; primary tool; capability; guarantees; overlap tags; aliases; and
whether the skill is required. `source_rel`, release digests, and budget fields
are executor/check inputs, not recommendation signals.

### 5.2 Refresh and failure policy

The generator runs during development/release and CI checks its bytes. Install
copies the pinned artefact. A later Rig upgrade replaces it through the normal
journal only when the installed copy is receipt-clean; a user-edited catalogue
conflicts rather than being overwritten. Onboarding never downloads a live
catalogue and never silently refreshes midway through a proposal. If the
catalogue digest changes, existing proposals become stale and must be rebuilt
and re-approved.

The full skill bodies remain in the non-discoverable runtime library. The MCP
tool returns the compact catalogue object, not every skill body. The agent may
open a specific body when evaluating a likely capability.

### 5.3 Seams, dependencies, verification

F-3 depends on F-1 metadata. Touched later: generator/check script,
`rig/manifest.json`, `payload.js`, release/version checks, and runtime library
copy. Tests assert deterministic bytes, complete/unique membership, valid
source paths, alias targets, immutable service-catalogue bytes, journalled
install/upgrade, stale proposal invalidation, and no network access.

## 6. F-4 — `.rig/` onboarding state

### 6.1 Files and authorship

| File | Authority and writer | Update rule |
|---|---|---|
| `.rig/adopted-config.md` | Mechanical facts; Rig code renders S-1 | Replace atomically on `prepare` when inventory digest changes |
| `.rig/overlaps.md` | Mechanical tag matches; Rig code renders S-2 | Replace atomically with the same inventory/catalog snapshot |
| `.rig/grafts.md` | Applied graft ledger; Rig code renders from state + parsed markers | Replace after each successful graft write and final check |
| `.rig/onboarding-summary.md` | Semantic content authored by host agent; validated and committed by Rig code | Written at `propose`; replacement changes proposal digest and needs approval |
| `.rig/state.json` | Sole machine authority; Rig code validates and writes | CAS by `revision`; every transition is journalled and atomic |

The agent never directly edits machine state or a repo-owned target. It passes
a proposal and summary to the engine. Rig code validates and serialises them.

### 6.2 Markdown contracts

`adopted-config.md` contains, in order: title; one sentence saying this is a
structural inventory, not an endorsement; inventory/catalog-independent digest
and counts; `Configuration` table with `Path | Host | Kind | Name | Capability
tags | Bytes | SHA-256`; `Warnings` table with `Path | Code | Detail`, or
`None.`. Rows are sorted by path.

`overlaps.md` contains: title; one sentence saying matches are hints and code
takes no action; `Tagged overlaps` table with `Existing path | Match tags | Rig
capability | Rig skills`; `Unmapped existing entries`; and `Rig capabilities
without a declared match`. Rows are lexical. The last set is informational and
does not mean install.

`grafts.md` contains: title; proposal digest; `Applied grafts` table with
`Capability | Path | Marker version | Content SHA-256 | Status`; `Selected skill
projections` table with `Skill | Host scope | Path`; and `Warnings`. It is a
projection of state, never a second authority.

`onboarding-summary.md` must contain these headings once, in this order:

```markdown
# Rig onboarding summary
## Existing state
## Rig interpretation
## Reuse
## Grafts and improvements
## New capabilities
## Important decisions
## Resulting pipeline
## Expected user experience
```

The engine rejects a missing/duplicate/out-of-order heading but does not judge
the prose. The summary must name excluded or unresolved areas honestly.

### 6.3 `state.json` schema

```json
{
  "schema_version": 1,
  "revision": 1,
  "phase": "prepared",
  "release": {
    "version": "<tag>",
    "catalog_digest": "<sha256>"
  },
  "inventory": {
    "digest": "<sha256>",
    "entries": 0,
    "warnings": 0
  },
  "proposal": null,
  "approval": null,
  "applied": {
    "proposal_digest": null,
    "skills": [],
    "grafts": [],
    "owned_files": []
  },
  "checks": null,
  "last_error": null
}
```

`phase` is exactly one of `prepared`, `needs-decision`, `proposed`, `approved`,
`applying`, `applied`, `checked`, `failed`.

A non-null proposal is:

```json
{
  "digest": "<canonical proposal sha256>",
  "inventory_digest": "<sha256>",
  "catalog_digest": "<sha256>",
  "summary_digest": "<sha256>",
  "capabilities": [
    {
      "capability": "testing.test-driven-development",
      "family": "testing",
      "disposition": "reuse | graft | add | omit",
      "existing_paths": ["AGENTS.md"],
      "rig_skills": ["rig-tdd"],
      "reason": "<agent-authored concise rationale>"
    }
  ],
  "selected_skills": ["rig-tdd"],
  "grafts": [
    {
      "capability": "testing.test-driven-development",
      "path": "AGENTS.md",
      "version": 1,
      "content": "<exact managed body>",
      "content_digest": "<sha256>",
      "preimage_digest": "<sha256|null>"
    }
  ],
  "owned_files": [
    {
      "path": ".rig/example.md",
      "kind": "instruction | configuration | workflow",
      "content": "<exact bytes as UTF-8 text>",
      "content_digest": "<sha256>",
      "preimage_digest": null
    }
  ],
  "critical_decisions": [
    {
      "id": "<stable kebab id>",
      "question": "<plain-language choice>",
      "consequence": "<material consequence>",
      "recommendation": "<one recommendation>",
      "status": "resolved",
      "resolution": "<user answer>",
      "authority": "user"
    }
  ]
}
```

Capability rows are sorted by capability; selected skills lexically; grafts by
`(path, capability)`; owned files by path; critical decisions by ID. A
capability may be omitted, but omission never deletes an existing repository
capability. `owned_files` may add only validated Rig-owned artefacts described
by the playbook. Its preimage must be null for a new path or match a
journal-proven Rig-owned path for replacement; it cannot smuggle unmarked
repo-file replacement. Its content digest must match `content`.

Approval is exactly
`{ "proposal_digest": "<sha256>", "method": "host-native | external-sshsig",
"receipt_digest": "<sha256>" }`; no key material is stored. Applied skill rows
are `{ "skill": "<canonical id>", "host_scope": "<host id>", "path":
"<relative path>", "sha256": "<sha256>" }`; applied graft rows are the proposal
graft row plus `status: "applied"` and the actual post-write file digest;
applied owned-file rows are `{ "path": "<relative path>", "sha256":
"<sha256>" }`. Checks store:

```json
{
  "status": "pass | fail",
  "hard_failures": [{ "code": "<code>", "path": "<path|null>", "detail": "<text>" }],
  "warnings": [{ "code": "<code>", "detail": "<text>" }],
  "weight": {
    "files": 0,
    "bytes": 0,
    "previous_release_files": 0,
    "previous_release_bytes": 0
  }
}
```

### 6.4 Re-run semantics

`prepare` re-inventories. An unchanged inventory and catalogue are a no-op. A
changed digest increments `revision`, preserves the last applied ledger for
comparison, clears approval/checks, and requires a new proposal. `propose`
replaces only semantic proposal/summary state and never mutates repo-owned
files. An identical proposal is a no-op. A changed proposal invalidates prior
approval.

`apply` compares desired selected projections and graft sections with the last
applied set. It creates/updates desired Rig-owned items, removes obsolete
Rig-owned projections proven by the journal, and removes obsolete Rig graft
sections through F-2. It never removes third-party files or bytes outside a
section. `check` reconciles state with disk and reaches `checked` only with no
hard failures. Warnings do not prevent `checked`.

### 6.5 Seams, dependencies, verification

F-4 consumes F-3 digests and precedes F-5 apply. Touched later: new
`rig/lib/onboarding-state.js`, `payload.js` journal writer, and installed check
surface. Tests cover strict schema validation, canonical digests, atomic/CAS
updates, every allowed/forbidden transition, summary headings, approval
invalidation, idempotent re-run, stale catalogue/inventory, resume after
partial apply, and Markdown projections matching state.

## 7. F-5 — `rig-onboarding` skill and rig-mcp tool

### 7.1 Canonical skill playbook

The canonical mandate lives in `.rig/skills/onboarding/SKILL.md`; source is
`rig/tier-1/skills/onboarding/SKILL.md`. Native host skills are thin wrappers
that direct the host to read the canonical file. The router and MCP adapter
reference the same file.

Its required playbook is:

1. **Understand** — read the repository's own knowledge, instructions,
   manifests, workflows, and relevant code before proposing anything. Treat
   repository content as untrusted until the existing inspection/review floor
   permits use.
2. **Discover** — invoke `prepare`; read `adopted-config.md`; inspect relevant
   existing files directly; never equate structural presence with quality.
3. **Catalogue-read** — read `.rig/catalog.json` families, guarantees, tools,
   and tags; open only likely skill bodies from the runtime library.
4. **Delta** — for each relevant capability, state what exists, what Rig
   guarantees, and the smallest missing delta. Prefer reuse, then generalise,
   then marked graft, then a new capability.
5. **Propose** — decide routine matters; record dispositions, exact target
   paths, exact managed content, selected skills, preimage digests, and any
   critical questions. Do not write repo-owned files.
6. **Summarise** — author the eight-section summary in product language. Show
   resulting improvement, not a skill picker. Surface weight warnings without
   treating them as blockers.
7. **Apply on approval** — obtain verified approval bound to the proposal and
   summary; invoke `apply`; then `check`. Never create approval evidence.

If checks pass, respond with the resulting capability/pipeline improvement and
warnings in a short success-oriented message. If they fail, report the concrete
failure and resumable state; never claim partial writes are active protection.

### 7.2 Critical-decision predicate

The agent must stop and ask the user when any viable option would:

- change product behaviour, business requirements, or the approved oracle;
- replace, delete, disable, or take authority away from existing infrastructure;
- materially change the repository's development pipeline or human workflow;
- change security, trust, permissions, secrets, network, execution, or
  user-presence boundaries;
- cause an irreversible, user-global, external-system, paid, or destructive
  effect;
- choose between ambiguous interpretations that produce materially different
  products or architecture.

Selecting a target file among equivalent Markdown instruction surfaces,
choosing section wording, selecting an obviously non-overlapping optional
skill, or choosing a mechanically valid projection is routine unless one of
the predicates above applies.

The engine cannot prove that the agent noticed every semantic fork. The skill
requires the agent to classify it. The MCP/CLI response returns unresolved
critical decisions as structured data. The host presents one decision at a
time with concrete options, consequences, and one recommendation. `propose`
may store `needs-decision`; `apply` rejects any unresolved critical entry.

### 7.3 Shared action interface

The domain entry is:

```js
handleOnboarding(request) -> response
```

Input is the following discriminated union:

```text
PrepareRequest = {
  schema_version: 1,
  action: "prepare",
  target: string
}

ProposeRequest = {
  schema_version: 1,
  action: "propose",
  target: string,
  expected_revision: positive integer,
  proposal: ProposalWithoutDigest,
  summary_markdown: string
}

ApplyRequest = {
  schema_version: 1,
  action: "apply",
  target: string,
  expected_revision: positive integer,
  approval: PlanApprovalReceipt
}

CheckRequest = {
  schema_version: 1,
  action: "check",
  target: string,
  expected_revision: positive integer
}
```

Every response has:

```json
{
  "schema_version": 1,
  "action": "prepare | propose | apply | check",
  "phase": "<state phase>",
  "revision": 1,
  "proposal_digest": null,
  "artifacts": {
    "catalog": { "path": ".rig/catalog.json", "sha256": "<sha256>" },
    "adopted_config": { "path": ".rig/adopted-config.md", "sha256": "<sha256>" },
    "overlaps": { "path": ".rig/overlaps.md", "sha256": "<sha256>" },
    "grafts": { "path": ".rig/grafts.md", "sha256": "<sha256|null>" },
    "summary": { "path": ".rig/onboarding-summary.md", "sha256": "<sha256|null>" },
    "state": { "path": ".rig/state.json", "sha256": "<sha256>" }
  },
  "critical_decisions": [],
  "hard_failures": [],
  "warnings": [],
  "next_action": "<plain machine-stable action token>"
}
```

`prepare` additionally returns `context: { playbook: string, catalog: object,
adopted_config: string, overlaps: string }`. Later calls return paths/digests
instead of repeating context. `next_action` is exactly one of
`inspect-repository`, `resolve-critical-decisions`, `obtain-approval`, `apply`,
`check`, `complete`, `repair-and-resume`.

The installed CLI accepts the identical request JSON:

```text
.rig/bin/rig onboarding --input <request.json>
```

and writes the response JSON to stdout. The MCP server registers
`rig_onboarding` with the same union as `inputSchema` and the same response as
`outputSchema`; structured content is the response and text content is a short
rendering of `next_action`, failures, and warnings. Its annotations are
`readOnlyHint: false`, `destructiveHint: true`, `idempotentHint: true`, and
`openWorldHint: false`. The tool is conservatively marked destructive because
`apply` can remove obsolete journal-proven Rig projections or managed sections,
even though it cannot delete repo-owned content outside those sections.

Both root `rig-mcp/` and the installed runtime copy import one adapter/helper;
their parity test remains byte/behaviour exact. No action logic lives in the
MCP server file or CLI parser.

### 7.4 Seams, dependencies, verification

F-5 consumes F-2/F-3/F-4 plus S-1/S-2, and adds the onboarding route to the
installed router. Touched later: new canonical skill and native wrappers, new
`rig/lib/onboarding.js`, `cli-advanced.js`/`materialize.js`, root and runtime
rig-mcp registration, manifest projections, and MCP parity tests.

Tests call the domain handler, CLI, and MCP stdio with the same fixtures and
assert identical state/output. They prove explicit invocation only, no
proposal-time repo mutation, unresolved critical blocking, summary-bound
approval, stale revision/digest rejection, no self-approval, selective
projection, marked-only grafting, idempotent resume, and honest terminal
success/failure.

## 8. F-6 — one installation command

### 8.1 Public grammar and current mapping

The public grammar is:

```text
install rig [--host <host>]... [--target <repository>] [--version <tag>]
```

The release's existing `install.sh` is the implementation behind the
`install` launcher; from an unpacked checkout the same command is path-qualified
as `./install rig ...`. `rig` is a required operand, not an install tier.

Mapping is exact:

- no `--host`: omit bootstrap `--hosts` and preserve bounded mechanical host
  detection;
- one or more repeatable `--host`: validate each ID through the existing host
  registry, de-duplicate while preserving first occurrence, join with commas,
  and pass one `--hosts <a,b,...>` to `bootstrap.sh`;
- always pass `--with-runtime`, because Path B needs the installed executor and
  non-discoverable skill library;
- preserve existing `--target`, `--version`, safe release download, and
  `--openclaw-mcp` compatibility, but do not advertise install tiers;
- an explicit host list replaces detection, exactly as today.

Bootstrap installs the mandatory core/onboarding skills, router/adapters,
runtime library, catalogue, and journal. It does not run `prepare`, read
semantic repository content, choose optional skills, produce a proposal, or
apply a graft.

The final normal output is one next step:

```text
Rig is installed. In your host agent, invoke rig-onboarding for this repository.
Nothing is adapted until you approve its onboarding summary.
```

If several hosts were explicit/detected, output names them and says the user may
invoke onboarding from any one of them; the state lock prevents competing runs.

### 8.2 Documentation shape

The README quick start and install page show only the canonical command, the
repeatable host example, and the explicit `rig-onboarding` next step. A short
host table shows how to invoke the skill/tool in native skill, prompt, and MCP
hosts. The advanced operator guide retains `install.sh`, `bootstrap.sh`, and
raw staged CLI forms as compatibility/diagnostic paths, clearly subordinate to
the one-command flow. Every page states that onboarding has no auto-trigger.

### 8.3 Seams, dependencies, verification

F-6 consumes F-3/F-5 and S-3. Touched later: launcher/`install.sh`,
`bootstrap.sh` flag translation and final message, README/install docs, and
operator compatibility docs. Tests prove zero/one/many host mapping, unknown
host refusal, order/de-duplication, detection when omitted, runtime/catalog
presence, no onboarding state before explicit invocation, and the exact next
step text.

## 9. S-1 — config inventory writer

### 9.1 Internal schema and deterministic extraction

`inspect.js` exports `HARNESS_DIRS`, `HARNESS_NAMES`, and
`collectHarnessFiles`. A new `inventoryHarness(target)` reuses the same
enumeration, containment, 256 KiB bound, hashing, and redaction rules. It does
not execute repository code or interpret prose.

```json
{
  "schema_version": 1,
  "digest": "<sha256 of sorted entries and warnings>",
  "entries": [
    {
      "path": ".agents/skills/example/SKILL.md",
      "host": "codex",
      "kind": "skill",
      "name": "example",
      "title": "Example",
      "headings": ["When to use"],
      "capability_tags": ["code-review"],
      "bytes": 123,
      "sha256": "<sha256>"
    }
  ],
  "warnings": [
    { "path": "<path>", "code": "oversized | unreadable | non-utf8 | malformed-frontmatter", "detail": "<redacted>" }
  ]
}
```

Kind is mechanically mapped from the known root: root instruction names and
the Copilot file are `instruction`; rules directories are `rule`; Kiro
steering is `steering`; skill `SKILL.md` files are `skill`; other files below a
skill directory are `skill-asset`; `hooks` is `hook`. Unknown known-root files
are `other`. Host comes from the same registry/path mapping, not application
shape.

`name` comes from bounded frontmatter for a skill, otherwise basename. `title`
comes from frontmatter title/name, then first ATX heading, then basename.
`headings` contains ATX heading text only. All extracted strings pass existing
secret redaction and whitespace normalisation. No body text is emitted.
Capability tags come only from valid self-declared `capability` and
`overlap_tags`; there is no keyword classifier.

Entries are unique/sorted by POSIX path. A duplicate real path through aliases
is a hard failure, not two entries. `adopted-config.md` is rendered from this
object exactly as F-4 specifies.

### 9.2 Dependencies, seams, verification

S-1 is mechanically independent of F-1, though F-1 metadata enriches skill
rows. F-5 `prepare` consumes it. Touched later: `inspect.js` or one adjacent
inventory module; no change to `profileRepo`. Tests cover every known root,
stable ordering/digest, title/headings only, redaction, bounds, malformed
frontmatter, contained symlinks, escaping symlinks, alias duplication, and
identical repeated Markdown output.

## 10. S-2 — overlap surface writer

### 10.1 Exact match rule

For an inventory entry `e`:

```text
E(e) = valid self-declared capability/tags
     ∪ exact aliases resolved by catalog.migrations for e.name
```

For a Rig skill `r`:

```text
R(r) = { r.capability } ∪ r.overlap_tags ∪ r.aliases
```

There is a mechanical overlap iff `E(e) ∩ R(r)` is non-empty. Exact alias
resolution contributes the canonical skill's capability/tags, not a guessed
prefix token. Unknown names and untagged prose remain unmapped for agent review.

The writer emits the F-4 `overlaps.md` sets:

- tagged overlaps, grouped by existing path then Rig capability;
- unmapped existing entries;
- Rig capabilities with no declared match.

The third set is `Rig capabilities − matched Rig capabilities`; it is not a
recommendation or an install list. Multiple skills under one capability are
listed together and are not automatically duplicates. The host agent reads the
actual relevant files and decides the semantic delta.

### 10.2 Dependencies, seams, verification

S-2 consumes S-1 and F-3 but can be implemented/tested independently with
fixtures. Touched later: new `rig/lib/adapt-overlap.js` or equivalent and F-5
prepare. Tests prove exact tag intersection, explicit alias mapping, no unknown
prefix stripping, no content keyword inference, deterministic set difference,
multiple-skill grouping, and zero selection/mutation side effects.

## 11. S-3 — single canonical entrypoint

`.rig/routing.md` remains the only always-on workflow mandate. `CLAUDE.md`,
`AGENTS.md`, `GEMINI.md`, Cursor/Windsurf/Cline/Kiro rules, and other host
adapters contain only the minimum native pointer to it. They do not duplicate
the pipeline. In a multi-host repository, several native pointers are expected;
they all lead to one mandate and therefore are not parallel frameworks.

`.rig/skills/onboarding/SKILL.md` is similarly the only onboarding playbook.
Native `rig-onboarding` discovery wrappers and the MCP tool load/reference it;
they do not carry independent playbook copies. Selected optional skills remain
normal host projections because they are executable capabilities, not global
entrypoints.

This support item can land independently as a projection rule, then F-5 adds
the onboarding entry. Touched later: router, host adapter templates, manifest
ops, native onboarding wrappers, MCP instruction loader. Tests search every
installed entrypoint and assert the mandate/playbook phrases exist once in the
canonical files and every adapter resolves to them without a dangling path.

## 12. S-4 — weight budget and correctness check

### 12.1 Metrics and warnings

The check computes current attributable weight from the latest applied journal
records:

- `files`: distinct existing paths carrying a current Rig-owned write or Rig
  graft;
- `bytes`: full current bytes for Rig-owned files, plus only managed-section or
  managed-line bytes for repo-owned files. Journal and preimage files count as
  Rig overhead.

It compares those totals with `catalog.soft_budget`. If a previous-release
budget is present and either total grows, it emits `payload-file-growth` and/or
`payload-byte-growth` warnings with old, new, and delta. Missing/zero baseline
still reports totals and emits no threshold warning. No file/byte value changes
the exit status.

### 12.2 Hard failures

The same check fails on these mechanical codes:

| Code | Condition |
|---|---|
| `duplicate-destination` | More than one planned/current write owns the same path unexpectedly |
| `duplicate-skill-projection` | The same canonical skill appears twice in one host discovery scope |
| `duplicate-graft` | A path contains more than one section for one capability |
| `malformed-graft` | A managed marker is orphaned, nested, mismatched, or unknown-version |
| `dangling-reference` | A canonical router/wrapper reference does not resolve on disk |
| `skill-name-mismatch` | Installed directory and rewritten frontmatter name differ |
| `self-prefix-regression` | Canonical `rig` projects as `rig-rig` or equivalent |
| `state-incomplete` | Applied disk/state/summary/catalog digests disagree or a required state file is absent |
| `unapproved-write` | A current graft/projection is not in the approved proposal/journal |

Two different skills in one capability are not a duplicate unless they resolve
to the same canonical skill or destination. One canonical runtime-library copy
plus one host projection is not a duplicate because the library is not a
discovery scope. Legitimate projections to distinct selected host scopes are
reported, not failed.

S-4 consumes journal/state/catalog data but can be built with fixtures. Touched
later: new Path B checker integrated into onboarding `check` and the existing
installed check command. Tests seed each failure independently, prove warnings
exit zero, prove hard failures exit non-zero, and reproduce the historical
double-write, dangling implementation path, and `rig-rig` regressions.

## 13. Touched seams in full

| Seam | Path B responsibility |
|---|---|
| Harness inspection | Export bounded enumeration and add structural inventory; do not change application profiling into authority |
| Skill catalogue loader | Recurse capability hierarchy, validate new frontmatter, preserve canonical names/aliases |
| Payload writer | Stage one runtime library, selectively project skills, add graft upsert/remove, keep pending/applied preimages |
| Lifecycle/uninstall | Remove all journal-proven graft sections per path without restoring whole repo-owned preimages |
| Resolver/service selection | Remains the governed service contract; skill selection lives in onboarding state, not `rig.json` |
| Profile | Remains advisory for services; never feeds skill selection |
| Manifest | Adds generated catalogue, runtime library, core onboarding skill/wrappers; no service-catalogue rewrite |
| Router/adapters | One canonical router and onboarding route; host files are pointers |
| Onboarding domain | New shared prepare/propose/apply/check handler and state renderer |
| CLI | One JSON adapter to the shared handler |
| MCP | One tool registered over the same handler/schema in source and installed copies |
| Installer/docs | One public grammar, repeatable host mapping, explicit next step, no auto-trigger |
| Checks | Warning-only weight plus closed correctness set |

No concurrency beyond the one repository lock is introduced. No daemon,
database, model key, telemetry, or network lookup is added.

## 14. Ordered implementation slices and verification

Implementation returns to grilling first for acceptance cases and red tests.
Once signed by the human, the smallest tracer-bullet order is:

1. **Catalogue spine (F-1 + F-3).** Add metadata to the current inventory,
   recursive loader, generator, runtime library, and installed catalogue.
   Verify: `node --test tests/path-b-catalog.test.js`.
2. **Mechanical context (S-1 + S-2 + F-4 prepared state).** Generate inventory,
   overlaps, Markdown, and initial state without semantic decisions.
   Verify: `node --test tests/path-b-inventory.test.js tests/path-b-state.test.js`.
3. **Safe graft primitive (F-2).** Land parser/upsert/remove plus journal and
   uninstall support before any agent can request a repo-owned edit.
   Verify: `node --test tests/path-b-graft.test.js`.
4. **Shared onboarding vertical slice (F-5 + S-3).** One fixture flows through
   prepare → agent-supplied proposal → verified approval → one selected skill +
   one marked graft → check, through domain/CLI/MCP parity.
   Verify: `node --test tests/path-b-onboarding.test.js tests/path-b-mcp.test.js`.
5. **Operator path (F-6).** Map the public install command and make the explicit
   host-agent invocation the only next step.
   Verify: `node --test tests/path-b-install.test.js`.
6. **Failure/weight closure (S-4).** Add every hard regression fixture and
   warning-only budget measurement, then re-run a dense multi-host adaptation
   as product evidence, not as a router prerequisite.
   Verify: `node --test tests/path-b-weight.test.js` plus the adaptation rubric.
7. **Full gate.** Run `npm test` once after all focused suites are green and
   before push.

Each slice leaves a runnable check. Implementation may change internal module
boundaries, but must preserve these external schemas, the oracle, and the
agent/code authority split unless it returns to the appropriate owner.

## 15. Rejected alternatives

- **Repository-shape → skill rules.** Faster to code but violates the locked
  mechanical-only boundary and repeats the imposition Path B exists to fix.
- **Install everything visibly, then prune.** Creates the duplicate/context
  problem before the user approves anything and makes removal the normal path.
- **Fetch selected skills from the network during onboarding.** Adds
  availability and supply-chain failure after approval. The pinned local
  runtime library is simpler and reproducible.
- **Put full skill bodies in `.rig/catalog.json`.** Makes the default agent
  context and every catalogue parse carry irrelevant megabytes. The index plus
  on-demand local body reads keeps context bounded.
- **Infer capability from arbitrary vendor prefixes or prose keywords.** A
  colon or word match is not a semantic guarantee. Exact aliases and declared
  tags are honest; the agent handles unknowns.
- **Restore a whole preimage on graft removal.** Would erase repository edits
  made after onboarding. Exact marked-section removal preserves them.
- **One journal record per section in the same file.** The current latest-path
  lifecycle would forget earlier sections. One record carries the full current
  section set.
- **Support every comment syntax in version 1.** Risks breaking JSON/YAML/code
  and expands the trust boundary without evidence. Markdown-compatible agent
  context is the current marked-write surface.
- **Let the MCP tool choose or approve.** Moves intelligence/authority into Rig
  code and permits self-approval. It only prepares, validates, applies approved
  bytes, and checks.
- **Hard file/byte ceilings.** The owner locked those measurements as warnings;
  correctness, not an arbitrary size, blocks.
- **Unify skill and service taxonomies.** The service catalogue is frozen,
  MECE, and grade-bearing; the skill shelf is a separate agent-context index.

## 16. Risks and returns to grilling

There is no current oracle contradiction. These discoveries would require a
return rather than a silent design workaround:

- a need for Rig code to infer relevant skills from application shape;
- a need to edit repo-owned bytes outside a marker or to delete/replace
  existing infrastructure;
- a need to make family taxonomy changes rather than membership edits;
- a need to combine the skill shelf with the governed service catalogue;
- a need to treat file/byte growth as a hard blocker;
- a need to auto-run onboarding or accept approval the agent can manufacture;
- a product requirement to graft directly into non-Markdown formats in this
  version.

Implementation risks that do not reopen intent are: host discovery depth for
flat native skills; large but non-discoverable runtime-library bytes; incomplete
third-party tags; multi-host projection accounting; and migration of existing
Rig-owned visible skill copies. The contracts above make each observable and
recoverable without semantic installer inference.

## 17. Design completion condition

Path B is technically specified when F-1 through F-6 and S-1 through S-4 have
red acceptance tests owned by grilling, the human signs the oracle, and TDD can
implement the ordered slices without inventing a schema, marker, ownership
rule, authority decision, or operator flow. This document supplies that handoff;
it does not sign the oracle or authorize implementation.
