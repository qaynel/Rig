# Tier 2 Advanced - Implementation Design (GATE 2 CANDIDATE v0.3)

> **Status: CANDIDATE. Not frozen. Not yet reviewed.** This version is written
> against the Gate 1 frozen on 2026-07-26 at 45 cases, including the D10
> integrity revision. It supersedes v0.2 in full. Implementation may not begin
> against a candidate: §16 lists what must be true before this file may be
> marked `FROZEN`.

**Gate 1 pins.** This candidate is written against exactly these bytes:

| Gate 1 file | SHA-256 |
|---|---|
| `business-spec.md` | `d874df9e012703e29c49532990d0809fdb227e55dcb480528e4b071b61f0293c` |
| `acceptance.md` | `5d1ddb0e89004c05fbe7733c6caa69f300e8fe97c3cbdb153dda2cd40afc1541` |

If either digest changes, this candidate is stale and every review receipt bound
to it is void.

**Authoring context.** Authored by `claude-opus-5`. `AT-GATE-3` requires the
review to run in a fresh session under a *different* model; the review wrapper
reads this field and refuses to run under the same one. This field is
self-declared by the authoring context and is the one link in the D8 chain that
is asserted rather than proven — recorded here so the reviewer knows it.

**Gate 1 integrity (D10).** Gate 1 is protected by signature, not by repository
process. The specification gate verifies an SSHSIG signature over the exact
message below, in namespace `rig-gate1`, against the trust record, before it
runs any other check:

```text
rig-gate1-freeze-v1
business-spec.md <sha256>
acceptance.md <sha256>
```

Lowercase hex, one trailing newline, paths exactly as written. The signature
must come from a key that attests hardware user presence; §7.4's downgrade
allowance does not apply here. There is no upstream-branch comparison, no branch
protection requirement, and no code-ownership requirement anywhere in this
design — GA-11 withdrew all three.

When re-frozen, this document is the single Gate-2 source of truth for
implementing the a-la-carte delivery model. A SOW, task list, coverage plan, or
later ruling cannot supersede it.

- Gate 1 rationale: [`../../archive/grilling/advanced-grilling.md`](../../archive/grilling/advanced-grilling.md)
  (the `GA-#` log; `GA-11` records the D10 integrity ruling)
- Shipped Basic mechanism being extended:
  [`../../archive/deprecated-tier-taxonomy/basic/basic-design.md`](../../archive/deprecated-tier-taxonomy/basic/basic-design.md)
  (archived MCP configurator design; packaging dissolved by GA-9g)
- Prior production-plan context (subordinate for the re-grilled catalogue):
  [`product-spec.md`](product-spec.md)

**Version history.** Gate 2 was frozen 2026-07-24; that freeze was withdrawn by
the 2026-07-25 re-grill. v0.2 absorbed the rulings of 2026-07-26 but was
superseded the same day by the D1-D9 Gate 1 revision, which it did not model.
v0.3 is a rewrite against D1-D10. Gate 1 remains the acceptance oracle
throughout.

**A note on the repository's default branch.** It is `prod`. `origin/main` does
not exist, and any mechanism, document, or workflow naming `main` or `master` is
wrong. This no longer affects Gate 1 integrity — D10 removed the branch
dependency entirely — but it still governs CI configuration and release tagging.

## 1. Gate 1 Restatement

Rig defaults to making the target's agent harness safe before offering the
complete Development, Testing, Infrastructure, and Product-Security catalogue
as `family -> group -> service -> grade`. The repo scan recommends; the user can
override every recommendation. Missing dependencies auto-pull only their exact
required slices. Every install grafts onto existing agent infrastructure.

The sanitation, drift, staged-secret, host-hook, git, CI, and network/action
protections are enabled and deny by default. The user may disable any
independent control, any enforcement surface, or all enforcement through an
exactly activated policy revision. Disabled behavior genuinely stops blocking;
Rig continues unrelated work while reporting the control as disabled or not
run. Re-enabling creates a fresh evidence epoch and cannot reuse a result from
before or during disablement.

One user-owned `.rig/network-policy.json` is authoritative for safety controls,
enforcement surfaces, and network/action allowances. The same policy is
evaluated for shell, built-in web, and network-capable MCP actions wherever a
verified host surface exists. An unsupported surface retains the installed
agent rule and produces an explicit enforcement gap, never a mechanical-block
claim.

**Rig builds for everyone and claims only what it has run (D1, D2, D3).** The
build set and the claim set are different sets, and conflating them was the
defect this revision closes. Adapters are built and configuration is emitted for
the complete 19-host and six-provider roster, so no user of any host receives
less than the pre-revision product gave them. An axis is *advertised as
verified* only where a real passing first wire exists. Every other axis ships as
emitted-but-unverified, says so in the user's own output, and is not thereby
excused from being built. The release gate binds the advertised set. Promotion
is not a release event: an axis promotes the moment its first wire passes, and
that must require no edit to Gate 1 and no edit to any list.

Disclosure never becomes friction. An unverified axis states its status and
invites a report; it does not interpose a prompt, a flag, or an
acknowledgement. A confirmation gate on the unverified path would suppress
exactly the field reports that promote it, and an undisclosed binding reads to
the user as a working one — so silence and prompting are both failures.

**Activation requires a present human, or it does not happen (D6).** Policy
activation uses a verified host-native presence prompt where one exists,
otherwise a user-configured external signature. Where neither is available,
activation is refused and reported unavailable. It is never silently skipped,
degraded to an ordinary confirmation, or treated as successful. Rig specifies
the signer interface and verifies signatures; it ships no signing binary and
stores no key material.

**Writes outside the repository are permitted, attributed, and never
destructive (D9).** Where a vendor ships only a user-global surface, Rig appends
or performs a namespaced additive merge, never an overwrite, and discloses the
global blast radius at install time. Every entry Rig writes to a shared
user-global file carries the identity of the repository that wrote it from the
first installation onward, so uninstalling one repository leaves every other
repository's configuration intact and reinstalling replaces rather than
accumulates.

**A product that cannot be installed is not shipped (D7).** Distribution is
inside this design, not an external dependency: a committed install stub, the
retirement of the inherited npm publish workflow, and a first production
release.

Rig remains B1 config:

- no model key;
- no daemon or independent agent runtime;
- no persistent semantic memory store;
- the host agent performs semantic judgment and repo-specific transition work;
- committed repo documents are the durable context.

The implementation is complete only when all frozen archetype, baseline,
property, and bespoke acceptance cases are executable and green.

## Final Mechanism Decisions

These decisions are implementation constraints, not suggestions:

| ID | Frozen mechanism |
|---|---|
| AD-1 | Extend the shipped `rig/materialize.js` entrypoint and `rig/lib/*`; preserve the legacy Basic CLI. |
| AD-2 | Keep catalogue choices in committed, leaf-only `rig.json`. Keep all safety choices in the separate user-owned `.rig/network-policy.json`; catalogue edits never authorize safety changes. |
| AD-3 | Keep source-owned service metadata in `rig/catalog.json` and service fragments under `rig/catalog/`. |
| AD-4 | Compose grades cumulatively as identity + minimal + mid + maximal fragments with strictly growing check-ID sets. |
| AD-5 | Resolve dependencies as named slices; never replace or silently raise a user-selected grade. |
| AD-6 | Default to `inspect -> host review -> recommend -> plan -> apply -> check`. An exactly activated policy may disable sanitation; the flow then records sanitation disabled/not run and continues without a clean/protected claim. |
| AD-7 | Treat target harness files as hostile bytes: bounded reads, no execution, redacted evidence, fail-closed uncertainty. |
| AD-8 | Keep remediation separate and read-only until approval. Exact proposal approval, unchanged preimages, transactional writes, observed-diff equality, no-op rejection, rollback, and a fresh sanitation run are required before success. |
| AD-9 | Graft through typed create/replace-owned/ensure-line/structured-merge/hook operations; never arbitrary shell plans. |
| AD-10 | Apply under an exclusive target lock with compare-and-swap preimages, rollback, baseline-first phases, and activation receipt last. |
| AD-11 | Materialize service prose once under `.rig/services/`; host surfaces get thin pointers only. |
| AD-12 | Ship every default control's dormant implementation, but wire and execute only the independent controls and enforcement surfaces enabled by the active policy. Installed code is not evidence that a control ran. |
| AD-13 | Carry an explicit `status: verified \| emitted \| unsupported \| advisory` field on every `{host, axis}` pair, and cross-check it against that axis's own evidence bundle **in both directions**: `verified` without a complete valid bundle fails, and a complete valid bundle left at `emitted` also fails. Neither the field nor the bundle is trusted alone, so the two cannot drift. Host-level citations and marker-only hooks never constitute a bundle. No list of advertised hosts exists anywhere; promotion flips one axis's own field. |
| AD-14 | Emit the complete catalogue menu; recommendations remain advisory and user selections win. |
| AD-15 | Attempt every service as `executable` first; that is the default disposition, not one of three peers. Executable services require real repo-adapted argv bindings with `shell: false`. `convention` is a fallback that must carry a service-specific named reason why execution is not meaningful for that service in particular; a generic or repeated reason scores as a coverage gap. `surfaceless` must name the exact reason nothing can run. Missing, malformed, silent, no-op, or unreasoned bindings are nonzero coverage gaps. |
| AD-16 | Write failed, vacuous, coverage-gap, disabled/unrun, activation-pending, and evidence-stale state where Gate 1 requires visibility. Routine current-epoch passes remain omitted from failure reports. |
| AD-17 | Reuse Basic's MCP resolver/renderers only for evidence-backed supported paths through the Infrastructure compatibility slice. Unsupported MCP, including `pi`, is retired from every legacy and catalogue emission path without deleting user-owned files. |
| AD-18 | Drive implementation from a complete executable transcription of Gate 1. The specification gate runs before code correctness; `npm test` remains the full code gate. |
| AD-19 | Validate candidate policy bytes strictly, hash the exact bytes with SHA-256, and keep the last activated bytes as a separate immutable snapshot. Unapproved edits are inert. |
| AD-20 | Prefer a verified host-native user-presence approval that attests the exact digest. Otherwise require an external SSHSIG signature verified through `ssh-keygen -Y verify` against a namespaced challenge. Where neither is available, **refuse activation and report it unavailable** — there is no third path. Both available methods produce one common, replay-resistant activation receipt; repository markers and ordinary TTY prompts are insufficient. Rig never invokes a signing binary and never stores key material. |
| AD-21 | Store one-use approvals clone-locally and uncommitted. Bind them to the complete normalized action and active policy, consume atomically before dispatch, and keep them valid only until used, changed, revoked, or expired by the native host; Rig adds no clock timeout. |
| AD-22 | Evaluate one normalized action policy across shell, built-in web, and network-capable MCP adapters. Narrow permanent allowances are the default authoring path; explicit category-wide allowance and global enforcement disablement remain available. |
| AD-23 | Integrate verified existing CI additively. With no CI, require explicit provider selection and exact plan approval before creating a minimal native pipeline. Unknown/malformed CI is preserved and fails visibly; verification requires a real first run. |
| AD-24 | Treat all 115 catalogue leaves as initial-release commitments: placeholders, generic filler, or repeated boilerplate keep release blocked. Treat the 19-host/six-CI roster as a **build** commitment and the first-wired subset as the **claim** commitment. An axis missing its contract or first-wire evidence is not release-blocking so long as it is built, emitted, and honestly disclosed; an axis that is *advertised* while missing any of them blocks release. Emitting nothing is permitted only for an evidence-backed genuinely unsupported axis. |

| AD-25 | Write user-global host configuration by append or namespaced additive merge only, never overwrite. Attribute every written entry to a repository identity from the **first** installation, using a generated ID stored clone-locally under `git rev-parse --git-path rig/`, with remote URL and repository realpath carried as entry metadata so removal reports name something a human recognises. The ID is never committed, so one user's uninstall cannot remove another user's entries. Uninstall removes only the current repository's entries; reinstall replaces them in place. |
| AD-26 | Emit a per-host claim line in install output and every run report, stating `verified` or `emitted — enforcement unverified, please report`, and naming any configuration written outside the repository. Never gate the unverified path behind a prompt, extra flag, or blocking acknowledgement. Silence and friction are both failures. |
| AD-27 | Ship a committed root install stub that fetches a released version tag from GitHub by name, defaulting to the latest release with an override for a specific one. Do not embed a build fingerprint: the stub and the source share one origin, so a pin protects nothing an attacker could not also edit. Download to a file and execute it; never pipe the network into a shell, because Rig's own default policy denies exactly that. Delete the inherited npm publish workflow and move `package.json` to `5.0.0`, still `private`. |
| AD-28 | Verify Gate 1's integrity by signature, not repository process: recompute both digests, verify the namespaced SSHSIG signature from a hardware-presence-attesting key, and fail closed. Run this check first in the specification gate, and run the specification gate first in `npm test`, short-circuiting the code tests. Provide `npm run test:code` for the development loop. The gate has no exemption, skip, or progress input of any kind. |
| AD-29 | Produce every review receipt through a wrapper that invokes the reviewer non-interactively with an explicit model flag and itself writes the model ID, the digest it computed over the reviewed bytes, and the timestamp. The reviewing agent supplies findings only, and never authors the fields that certify its own independence. |

### Rejected Approaches

- A second installer, target daemon, Rig model key, or mutable memory database:
  duplicates the shipped spine or violates B1.
- YAML, a template engine, or a new validation dependency: unnecessary for the
  strict JSON and cumulative-fragment contract.
- Persisted group selections or grade-specific service IDs: obscures the frozen
  per-service grade choice.
- Whole-group dependency pulls or dependency-grade escalation: violates exact
  razor-scoped auto-pull.
- A combined scan/profile/install command or automatic remediation: makes
  sanitation ordering and user consent unprovable.
- Blind copies, malformed-config fallback, arbitrary shell operations, or
  user-file deletion: violate graft/no-clobber safety.
- Duplicated full service prose per host: creates footprint and drift.
- Speculative hook/CI paths for unverified hosts: overclaims host support.
- Installing test/security/infra engines during onboarding: exceeds the frozen
  convention-and-binding delivery model.
- A non-disableable baseline, a single coarse baseline switch, or hidden
  enforcement after disablement: contradicts complete user control and truthful
  status.
- Safety toggles in `rig.json` or split safety/network authorities: couple
  catalogue selection to authorization or create policy-precedence ambiguity.
- Canonicalized or section-level policy approvals: make normalization or
  mixed-revision precedence part of the authorization boundary. Exact validated
  bytes are simpler and stronger.
- A committed approval marker, an unattended signing key, or TTY confirmation
  alone: an agent with repository/shell access could self-authorize.
- Repository-shared one-use approvals or category/target-only action identity:
  allow replay or authorize materially changed actions.
- A Rig-imposed five-minute/session timer: expires unchanged user intent while
  adding clock/session machinery. Context changes, explicit revocation, native
  expiry, and atomic consumption are the meaningful invalidators.
- A bundled naive history grep presented as the leak-scanner service: creates a
  misleading security ceiling. A vetted existing scanner is required and its
  absence blocks service activation.
- Generic success bindings, silent binding skips, note-only scans, no-op
  remediation, marker-only live hooks, or advisory-only CI verification:
  fabricate completion without observable behavior.
- A single source for claim status — either a declared field alone or status
  derived from evidence alone. A field alone can lie; derivation alone silently
  demotes a half-filled bundle instead of failing on it. Requiring both to agree
  is what gives the release gate teeth.
- A hard-coded list of advertised hosts, in any file, that a promotion would
  have to edit: `AT-HOST-4` forbids it, and it would make honesty a release
  activity rather than a property.
- A confirmation prompt, extra flag, or acknowledgement on the unverified host
  path: it suppresses the field reports that promote the axis, and makes the
  honest path harder to use than the verified one.
- Branch protection, code ownership, or an upstream-branch comparison as the
  Gate 1 integrity mechanism: withdrawn by GA-11. It charges every Gate 1 edit
  to the commit history that organisations audit, and it is bypassable by anyone
  holding push rights, so it is both noisier and weaker than a signature.
- Comparing Gate 1's working tree against its locally committed state: stops an
  agent from editing Gate 1 but not from committing that edit, which agents do
  routinely. It would pass while failing at its only job.
- An unsigned digest pinned in this file as the sole Gate 1 protection: it forces
  a visible multi-file edit, which makes it an audit trail and a deterrent, but
  the product does not describe deterrents as protection.
- A build fingerprint embedded in the install stub: the stub and the source come
  from the same repository, so anyone able to move a version tag can equally
  edit the fingerprint beside it. Accidental retagging is a repository setting's
  problem, not an installer's.
- `curl | sh` installation: Rig's own default policy denies
  `remote_content_execution`, and an installer that breaks the product's rule in
  its first five seconds cannot be defended.
- Lazy or retrofitted user-global attribution added on the second install: an
  unattributed first entry can never be safely removed, and back-filling
  attribution into a user's global file is a migration this product declines to
  owe.
- A prune subsystem for orphaned user-global entries: `AT-HOME-2` does not ask
  for it. Status output names entries whose recorded repository no longer holds
  an install, and the user removes them.
- Parallel or template-driven catalogue authoring: the failure this project is
  recovering from was 432 placeholder files produced at volume. Leaves are
  authored one at a time.

## 2. Current-State Trace

The preserved legacy flow is:

```
config JSON
  -> rig/materialize.js
  -> rig/lib/config.js validation
  -> rig/lib/payload.js fixed Tier 1 payload
  -> rig/lib/renderers.js MCP variant assignment + host merge
  -> rig/lib/credentials.js value-free credential outputs
  -> rig/lib/guard.js pre-commit secret floor
  -> rig/lib/receipt.js Basic receipt
```

The in-progress catalogue flow now exists:

```text
subcommand
  -> rig/lib/cli-advanced.js
  -> inspect/recommend/plan/apply/check modules
  -> rig/catalog.json + rig/catalog/services/**
  -> .rig/catalog-receipt.json + generated baseline/services/bindings
```

Relevant existing seams:

| Seam | Current behavior | Gate 2 use |
|---|---|---|
| `rig/materialize.js` | Preserves legacy flow and delegates Advanced subcommands | Keep the split; add policy/approval orchestration without moving domain logic into the entrypoint. |
| `rig/lib/config.js` / `catalog.js` | Zero-dependency validation; catalogue validator currently rejects any baseline disablement | Keep strict validation; remove obsolete rejection and add the separate exact policy schema. |
| `rig/manifest.json` | Canonical fixed Tier 1 payload | Leave as the legacy payload owner. Do not overload it with user selection. |
| `rig/lib/payload.js` | Copies fixed files and appends host pointers | Legacy only. New grafts use typed operations because blind copies can overwrite. |
| `rig/lib/renderers.js` | Legacy MCP shapes still include unsupported `pi` output | Reuse only evidence-backed shapes, fail closed on malformed config, and retire unsupported MCP across legacy/catalogue paths. |
| `rig/lib/guard.js` | Real staged-secret floor and chained pre-commit shim | Retain as the deterministic secret control; make invocation policy/surface-aware and add the other enabled dispatcher controls. |
| `rig/lib/receipt.js` | Tracks Basic-owned MCP output | Reference during adoption; add a separate catalogue receipt. |
| `rig/lib/plan.js` / `apply.js` | Typed plan, lock, partial CAS/rollback, generated files; apply currently accepts any truthy plan digest | Reuse the transaction spine; verify exact plan approval/content and add policy, real binding, scanner, remediation, host, and CI operations. |
| `rig/lib/checks.js` / generated `check.js` | Source and installed runners diverge; both can silently skip missing bindings | Replace with one shared contract that iterates selected services and reports every missing/malformed/no-op binding nonzero. |
| `rig/lib/host-capabilities.js` | 19 entries, aggregate citations, and marker-only “verified” live hooks | Split by shell/web/MCP/approval axis and demote until each exact contract/evidence/first-wire bundle exists. |
| `rig/lib/ci-adapters.js` | GitHub Actions only; other five providers degraded and absent-CI bootstrap unspecified | Implement six exact adapters, approved provider choice/bootstrap, safe collision behavior, and target first-wire lifecycle. |
| `docs/agent-portability.md` | Actual host instruction/plugin surface | Starting evidence for the capability registry. |
| `scripts/check-rule-copies.js` | Source-repo exact-copy guard | Pattern for target-local `.rig/sync-map.json` checking. |

Audited blocking gaps on 2026-07-26:

- `.rig/network-policy.json`, its guide, exact activation, trusted user-presence
  approval, clone-local one-use approval, and shell/web/MCP evaluation do not
  exist; manifest validation explicitly rejects baseline disablement;
- every selected service receives generic `process.exit(0)` diff/repo bindings,
  and absent bindings are silently skipped in source and installed runners;
- 108/115 services contain 432 `TODO(Slice 10)` fragments; the other seven and
  all dependency slices use forbidden generic/repeated filler, so 0/115 is
  semantically accepted;
- first-enable history scan records only a note and never launches a scanner;
- remediation validates a digest then returns success without applying,
  verifying, rolling back, or re-scanning any write;
- current host “verification” is a host-level citation plus a markdown marker,
  not an exact shell/web/MCP contract or first-wire result;
- five CI providers remain degraded; existing-CI safety, absent-CI approved
  bootstrap, collision handling, and target first-run verification are
  incomplete;
- traceability/tests encode the withdrawn non-disableable baseline and omit the
  re-grilled Gate 1 cases.

Important constraints discovered in the trace:

- `runPayload()` can overwrite same-path files and is unsuitable for the new
  no-clobber path.
- `mergeJson()` currently treats malformed JSON as empty. The new path must
  fail closed instead of replacing malformed user content.
- the Basic receipt does not own copied Tier 1 payloads and cannot by itself
  prove those paths safe to replace;
- the current guard's installation is coupled to MCP in the legacy path. The
  catalogue path must materialize dormant default control machinery
  independently of service selection, then wire only active policy surfaces.

## 3. Architecture

### 3.1 Source-owned files

Implementation adds:

```
rig/
  catalog.json
  catalog/
    baseline/
      sanitation-rules.json
      sanitation-review.md
      drift-rule.md
      default-network-policy.json
      network-policy-schema.json
      network-rules.md
      report-schema.json
      security-review-schema.json
    services/
      <family>/<group>/<service>/
        identity.md
        minimal.md
        mid.md
        maximal.md
        slices/
          <slice>.md
  lib/
    catalog.js
    inspect.js
    profile.js
    resolve.js
    plan.js
    apply.js
    reports.js
    checks.js
    host-capabilities.js
    policy.js
    actions.js
    approvals.js
    host-adapters.js
    ci-adapters.js
```

The exact module split may combine files when the resulting implementation is
shorter. Ownership boundaries must remain: pure catalogue validation,
read-only inspection/profile, pure dependency resolution, pure plan creation,
and side-effecting apply.

### 3.2 Target-owned and Rig-owned files

After a catalogue install:

```
rig.json                              # user-owned committed selection
.rig/
  network-policy.json                 # user-owned candidate safety policy
  network-rules.md                    # Rig-owned explanatory guide
  catalog-receipt.json                # Rig-owned install evidence
  catalog-routing.md                  # Rig-owned selected-service router
  context-index.json                  # Rig-owned central context map
  sync-map.json                       # Rig-owned exact-copy groups
  service-bindings.json               # Rig-owned argv bindings
  service-activation.json             # Rig-owned activation/evidence epochs
  global-writes.json                  # Rig-owned ledger of configuration written outside the repo
  policy/
    trust.json                        # signed public bootstrap/rotation record
    active.json                       # exact active bytes + common activation receipt
    allowed-signers                   # public verification identities; no private material
  baseline/
    drift-rule.md
    sanitation-review.json
  services/
    <service-id>.md                   # identity + effective grade/slices
  bin/
    check.js
    check-copies.js
    policy-evaluate.js
    policy-status.js
    secret-guard.sh
  hooks/
    pre-commit.sh
reports/
  rig/
    <run-id>.json                     # only failed/vacuous/coverage-gap runs
```

Host files contain one pointer or a thin native-skill wrapper, not duplicated
service prose. CI receives an additive job/file only where its adapter can be
verified; every repo still receives `.rig/bin/check.js`.

Clone-local one-use approvals live below the path returned by
`git rev-parse --git-path rig`, never an assumed `.git` directory, and are
never committed, copied into install receipts, or uploaded as CI artifacts.
This keeps normal clones and worktrees distinct. Private signer material lives
outside the target repository in the user-controlled host/OS approval facility.
The committed public trust record lets clean CI checkouts verify the active
bundle, but changing or deleting it cannot bootstrap a new signer.

The same clone-local directory holds `install-id`, a generated identifier
created at first install and used to attribute every entry Rig writes to a
user-global file (§6.4). It is deliberately **not** committed. A committed
identifier would be shared by everyone who clones the repository, and one
developer's uninstall would then strip entries from a teammate's personal
configuration file. Because it is clone-local, a linked worktree receives its
own identity, which is correct: two worktrees are two installations and each
must be able to remove its own global entries without disturbing the other.

The cost of clone-local identity is that deleting a repository without
uninstalling orphans its global entries permanently, since nothing remains that
knows the identifier. Rig does not build a reaper for this. `policy status`
lists any Rig-written global entry whose recorded repository path no longer
contains an install, and the user removes it. Disclosure rather than a
subsystem.

### 3.3 Runtime shape

There is no resident process. Node is used in three bounded situations:

- source-side onboarding/materialization;
- git/CI deterministic checks;
- explicit service-run wrappers.

The semantic reviewer and transition installer are host-agent skills. They
produce or consume typed JSON artifacts; they do not call a Rig model.

## 4. Catalogue Contract

### 4.1 Canonical IDs

IDs are lowercase dot-separated ASCII:

```
<family>.<group>.<service>
```

Renames require aliases in source metadata but the target manifest always
normalizes to the canonical ID. An ID may own exactly one service. Families and
groups are catalogued but are not persisted as selections.

The inventory is transcribed from Gate 1:

- Development: the named code creation, quality, debugging, dependency,
  documentation, architecture, data/schema, profiling, and repo-hygiene
  groups;
- Testing: ten general testing groups plus the ten-service Mutation group;
- Infrastructure: the ten frozen groups, including chaos/capacity and the
  environment/config compatibility slice;
- Product-Security: the four frozen groups with their post-MECE services.

An expected-ID fixture pins this inventory so a source entry cannot disappear
silently.

### 4.2 Catalogue entry

Conceptual shape:

```json
{
  "id": "testing.mutation.mutant-generator",
  "family": "testing",
  "group": "mutation",
  "label": "Mutant generator",
  "owns": ["mutation.operator-selection", "mutation.mutant-production"],
  "excludes": ["mutation.execution", "mutation.reporting"],
  "disposition": {
    "kind": "executable",
    "binding": {
      "discovery": ["existing-repo-command", "configured-vetted-tool"],
      "diff": ["<command>", "<argv...>"],
      "repo": ["<command>", "<argv...>"],
      "timeout_ms": 600000
    }
  },
  "fragments": {
    "identity": "catalog/services/.../identity.md",
    "minimal": "catalog/services/.../minimal.md",
    "mid": "catalog/services/.../mid.md",
    "maximal": "catalog/services/.../maximal.md"
  },
  "checks": {
    "minimal": ["generate-core-operators"],
    "mid": ["configure-domain-operators"],
    "maximal": ["author-custom-operators"]
  },
  "slices": {
    "mutation-floor": {
      "fragment": "catalog/services/.../slices/floor.md",
      "requires": []
    }
  },
  "requires": {
    "minimal": [
      {
        "service": "testing.unit.test-case-generation",
        "slice": "behavior-oracle"
      }
    ],
    "mid": [],
    "maximal": []
  },
  "applicability": {
    "any": ["source-code"],
    "not_recommended_without": ["test-runner"]
  },
  "surfaceless_reason": null,
  "acceptance_evidence": [
    {
      "check_id": "generate-core-operators",
      "target": "tests/advanced-services.test.js"
    }
  ]
}
```

`owns` keys are globally unique. `excludes` documents adjacent boundaries for
semantic review. Mechanical validation proves uniqueness and non-empty strict
grade growth; an authored scope-map test covers the frozen MECE spot checks.

Every entry declares exactly one honest disposition:

- `executable`: a real target-adapted process binding with discovery rules,
  diff/repo argv, timeout, expected observable result, and first-wire target;
- `convention`: service-specific installed behavior plus an executable verifier
  of that installed state, without a fabricated command;
- `surfaceless`: a deterministic applicability predicate and specific reason
  why execution is impossible; only this disposition may complete vacuously.

An executable binding may reuse an existing repo command, native tool, or
already installed dependency. It may not be `true`, `echo`, an empty command,
`process.exit(0)`, or any equivalent generic-success stub. A selected
executable service with no applicable valid binding is `coverage_gap` and
nonzero, never silently skipped.

### 4.3 Grade composition

Effective check sets are:

```
minimal = minimal checks
mid     = minimal + mid checks
maximal = minimal + mid + maximal checks
```

The materialized service file follows the same concatenation. A grade fragment
cannot redefine identity, family, group, owned scope, dependencies, or report
behavior.

### 4.4 Dependencies

Resolution input is the user's leaf map. Resolution output preserves:

- `selected_grade`, if any;
- `required_slices`, sorted;
- `required_by`, sorted;
- `install_reason`: `selected`, `dependency`, or both.

Algorithm:

1. Validate every selected ID and grade.
2. Seed the effective map with explicit selections.
3. Walk each service's named dependency edges in canonical ID order.
4. For an explicit grade, walk requirements attached to all included cumulative
   grade fragments.
5. For a dependency-only slice, walk only that slice's requirements.
6. Add only the referenced slice to the dependency entry.
7. Repeat to a fixed point.
8. Reject a cycle with its full path.
9. Topologically sort effective entries, then use ID as the stable tie-break.

The ladder is metadata, not a second resolver. Each rung maps to a small,
audited floor-slice bundle. Selecting a higher-rung service expands the exact
earlier bundles. It never expands an entire group.

### 4.5 Existing Rig skill reuse

When a frozen service matches an existing Rig skill, its identity fragment
references that skill as the implementation source. Examples include feature
implementation, structured debugging, product design, TDD, and code review.
The catalogue may add grade/slice overlays, but it does not fork the base skill.

### 4.6 Authored-service gate and current state

All 115 leaves are individually authored product commitments. A complete leaf
contains service-specific identity, owned scope, adjacent exclusions,
applicability, explicit dependencies or `none`, cumulative grade behavior,
disposition, checks, and acceptance evidence. The mechanical gate rejects
`TODO`, `TBD`, known generic filler such as `Concrete convention`, repeated
normalized fragment bodies, generic check IDs, and missing evidence targets.

Mechanical presence is necessary but not sufficient. A fresh-context catalogue
review covers every leaf and adjacent MECE boundary, records one semantic
verdict per service, and binds its receipt to the exact catalogue plus fragment
digest. A changed byte invalidates the review.

As audited on 2026-07-26, **0 of 115 leaves meets this gate**: 108 services
contain `TODO(Slice 10)` in four core fragments (432 files), and the remaining
seven use forbidden generic filler; the dependency-slice bodies are also
repeated boilerplate. The prior Slice 10 completion claim is withdrawn. No
inventory/non-empty test can promote this state.

## 5. Staged Onboarding Data Flow

### 5.1 CLI seams

The legacy seam remains:

```sh
node rig/materialize.js --target <repo> --manifest <basic-config.json>
```

The new seams are:

```sh
node rig/materialize.js inspect \
  --target <repo> --host <host-id> --out <inspection.json>

node rig/materialize.js recommend \
  --target <repo> --review <review.json> --out <recommendation.json>

node rig/materialize.js plan \
  --target <repo> --manifest <repo>/rig.json \
  --review <review.json> --out <plan.json>

node rig/materialize.js apply \
  --target <repo> --manifest <repo>/rig.json \
  --review <review.json> --plan <plan.json> \
  --approval <plan-approval.json>

node rig/materialize.js remediate \
  --target <repo> --proposal <proposal.json> \
  --approval <proposal-approval.json>

node rig/materialize.js check \
  --target <repo> --scope <diff|repo>

node rig/materialize.js policy status \
  --target <repo>

node rig/materialize.js policy activate \
  --target <repo> --policy <network-policy.json> \
  --approval <policy-approval.json>

node rig/materialize.js approvals list \
  --target <repo>

node rig/materialize.js approvals revoke \
  --target <repo> --action-digest <sha256>
```

The CLI remains argument parsing and orchestration. Domain logic stays under
`rig/lib/`. Approval files contain a verified host-native attestation or
external user-presence signature; a bare digest flag is never approval.

Before inspection, onboarding resolves policy state:

1. the shipped exact default is active when no prior activation exists;
2. an existing active snapshot and receipt must verify or onboarding fails
   closed;
3. a changed candidate remains `pending_activation` while the prior snapshot
   stays active;
4. if the active policy enables sanitation, the normal inspection/review gate
   runs before profile or menu;
5. if it disables sanitation, inspection is skipped and the run records
   `disabled`/`not_run` with no inherited clean verdict.

The shipped default is not an editable self-authorization path: it enables all
control leaves and enforcement surfaces and denies protected network/action
categories. Every revision away from those bytes requires exact user approval.

### 5.2 Inspect

`inspect` is read-only with respect to the target. It:

1. validates and records the user-chosen host;
2. canonicalizes the target and refuses paths outside it;
3. discovers only agent-harness/config surfaces;
4. rejects out-of-root symlinks and records unreadable/oversized files;
5. computes SHA-256 for every input;
6. runs the audited deterministic detector set;
7. emits redacted findings and bounded context;
8. emits an aggregate `harness_digest`.

It does not profile application code and does not emit the catalogue menu.

### 5.3 Host semantic review

The bundled sanitation-review skill consumes the inspection artifact. It may
read additional harness context only through the same bounded reader rules. It
emits:

```json
{
  "schema_version": 1,
  "harness_digest": "<sha256>",
  "host": "codex",
  "verdict": "ALLOW_WITH_RESTRICTIONS",
  "findings": [],
  "restrictions": [],
  "unverifiable": [],
  "reviewer": {
    "kind": "host-agent",
    "host": "codex"
  }
}
```

Verdicts are exactly `ALLOW`, `ALLOW_WITH_RESTRICTIONS`, `QUARANTINE`, or
`BLOCK`. Unambiguous blocker rules force `BLOCK`; uncertainty or unverifiable
inputs force `QUARANTINE`. The validator recomputes the harness digest before
every later phase. Restrictions must be known typed IDs with plan behavior;
unknown/free-form restrictions are unverifiable and force `QUARANTINE`.

### 5.4 Recommend

An allowed, current review unlocks `recommend` when sanitation is enabled. An
exactly activated sanitation disablement also unlocks it, but the output carries
the disabled control state and no sanitation verdict. Profiling uses bounded,
non-executing signals:

- repo purpose and package/build metadata;
- languages and frameworks;
- CLI, library, service, UI, data, network, and infrastructure surfaces;
- existing tests, CI, linters, scanners, and deployment config;
- existing agent framework and selected hosts.

Applicability rules emit the complete catalogue:

```json
{
  "service_id": "testing.e2e.browser-automation",
  "recommendation": "not_recommended",
  "recommended_grade": null,
  "evidence": ["no-ui-surface"],
  "reason": "No browser or UI surface was detected."
}
```

`not_recommended` is never `unavailable`. The host agent displays every leaf
and writes only choices the user confirms to `rig.json`.

### 5.5 Plan

`plan`:

1. validates `rig.json`, source ref, catalogue digest, and candidate/active
   policy state;
2. revalidates sanitation review freshness when enabled, or records the
   approved disablement;
3. resolves dependency slices and ladder order;
4. resolves every selected service disposition and binding/verification plan;
5. determines per-axis host degradation from complete contracts and evidence;
6. detects CI and, when absent, requires an explicit verified provider choice;
7. adapts service conventions to detected repo facts;
8. inventories every target collision and before hash;
9. emits exact typed graft, policy-wiring, and CI operations;
10. emits a content-bound plan digest and human-readable summary.

Plan creation writes nothing to the target.

### 5.6 Apply

`apply` verifies exact user approval of the plan digest and rechecks the
manifest, applicable review/disablement, active policy, plan, target preimages,
and source catalogue. It acquires `.rig/catalog-install.lock` with exclusive
creation, stages files under the target filesystem, and commits operations in
phase then lexical path order: policy/default control machinery, enabled
control/surface wiring, services, pointers/adapters, CI, final receipts.
Service runners require the complete final receipt, so no selected service can
operate against partial policy or binding state.

If any operation fails:

- new files from this transaction are removed;
- appended/merged files are restored from preimages;
- the prior hook is restored;
- no new receipt is written.

The lock records PID and start time for diagnostics but is never auto-broken.
The user removes a stale lock explicitly after verifying no apply is active.

## 6. Graft Mechanics

### 6.1 Ownership classes

Every path is one of:

- **absent**: `create_owned` is allowed;
- **Rig-owned and receipt-clean**: `replace_owned` is allowed;
- **byte-identical shipped legacy payload**: adopt, then treat as Rig-owned;
- **user-owned**: pointer append or namespaced structured merge only;
- **conflicting/unknown**: block and explain.

Install and upgrade never delete a user path. Uninstall removes only receipt-
owned files and managed entries, and restores chained hooks.

### 6.2 Instruction graft

The central entry is `.rig/catalog-routing.md`. Host adapters use the smallest
verified surface:

| Host surface | Graft |
|---|---|
| Repo-local native skills | Thin skill wrapper that points to one central selected service. |
| Always-on project rules | Stable pointers to `.rig/catalog-routing.md`, authoritative `.rig/network-policy.json`, and explanatory `.rig/network-rules.md`. |
| Verified live shell/web/MCP hook | Additive native adapter that normalizes the documented vendor event, invokes the common policy evaluator, and returns the documented allow/deny/proceed response. |
| No verified enforcement hook | Project policy instruction plus each enabled deterministic git/CI surface; status names the missing mechanical surface as a gap. |

Existing `AGENTS.md`, `CLAUDE.md`, and equivalent files are never replaced.
The pointer is appended once. Where an existing framework already has a router,
the pointer is added to that router instead of creating a competing framework.

A host adapter is not a pointer or marker. Before an axis may be `verified`,
this specification must name its exact emitted path/filename, vendor
input/event schema, matcher fields, deny payload and exit/process behavior,
deliberate-proceed protocol, owned merge namespace, preservation rules, and
first/repeated-apply behavior. Its axis-local evidence must then prove that
contract through authoritative vendor documentation and a successful first
wire. Until both exist, the axis is incomplete, emits no speculative config,
and blocks the advertised initial release unless the vendor surface is
genuinely unsupported.

### 6.3 Repo transition

Service templates specify:

- owned behavior and explicit non-goals;
- profile evidence they require;
- minimal/mid/maximal checks;
- exact dependency slices;
- target convention and existing-tool reuse order;
- allowed additive artifacts/merges;
- one explicit executable/convention/surfaceless disposition;
- diff and whole-repo binding plus discovery/first-wire behavior when
  executable;
- installed-state verifier when convention-only;
- surfaceless predicate, specific reason, and report behavior;
- service-specific acceptance evidence.

The host transition skill consumes this contract and the plan. It prefers:

1. an existing repo command/tool;
2. a standard-library/native platform feature;
3. an already installed dependency;
4. a new service-specific convention-only artifact and verifier.

It does not install a new engine or modify an existing dependency/lockfile as
part of catalogue onboarding. Such changes require a separate normal
implementation task and user approval.

The Product-Security leak-scanner service is stricter: first enablement must
discover a configured vetted scanner such as Gitleaks, TruffleHog, or an
explicit equivalent and invoke its documented full-history mode. Rig does not
install a scanner and does not substitute its staged-secret regex floor for the
history scan. A missing scanner, finding, or execution failure leaves the
service `pending_history_scan` and nonzero while the separately enabled staged
floor remains active.

### 6.4 User-global writes and repository attribution

Some vendors ship no repository-scoped configuration surface at all. For those,
the choice is to write the user's global file or to leave that host unserved,
and `AT-CLAIM-1` forbids leaving it unserved. Rig therefore writes outside the
repository under strict rules.

Every such write is an append or a namespaced additive merge. Rig never
overwrites a user-global file, never rewrites it wholesale, and never deletes a
value it did not write. Every pre-existing user value survives byte-for-byte.

Every entry carries the writing repository's identity, from the first
installation onward:

| Surface format | Attribution mechanism |
|---|---|
| JSON | Entries nested under a Rig-owned namespace keyed by install ID. |
| TOML | The same, expressed as a namespaced table per install ID. |
| Line-oriented or markdown | Sentinel fences carrying the install ID, wrapping only Rig's own lines. |

Attribution is required on the first install, when no second repository exists
yet. This is deliberate and is the one part of §6.4 that looks like premature
generality but is not: an unattributed entry can never afterwards be safely
removed, because nothing distinguishes it from a value the user wrote by hand.
Attributing lazily on the second install would leave the first install's entries
permanently unremovable and would owe the user a migration that back-fills
identity into a file Rig does not own. `AT-HOME-2` rules that out explicitly.

Operations:

- **Install.** Append or namespaced-merge this repository's entries. Record each
  written path, surface, format, and entry key in `.rig/global-writes.json`.
- **Reinstall.** Replace this repository's entries in place. The result is
  idempotent — never a duplicated or accumulating entry.
- **Uninstall.** Remove only this repository's entries. Another repository's
  entries and every unattributed pre-existing user value survive byte-for-byte,
  and the other repository keeps working. The removal report names the
  repository whose entries were removed, using the recorded realpath and remote,
  and does not claim to have removed entries belonging to another repository.

A user-global write changes behavior in every project that host opens. That
blast radius is disclosed in the install line under §6.5. There is no separate
prompt: `AT-CLAIM-3` forbids adding friction to this path, and the disclosure is
the control.

### 6.5 Claim disclosure

Install output and every run report state each installed host's claim status in
the user's own words:

- `verified` — a real first wire has passed for this axis;
- `emitted — enforcement unverified, please report` — configuration was written
  and enforcement has not been observed.

The line also names any configuration written outside the repository. Silence
fails `AT-CLAIM-2`: an undisclosed binding reads to the user as a working one.

The disclosure never gates. Rig adds no confirmation prompt, no extra flag, and
no blocking acknowledgement to the unverified path, which is exactly as usable
as the verified one. Only the claim differs. A design that makes the honest path
harder to use suppresses the reports that would promote it, and would make Rig
quieter about its weakest axes precisely where it should be loudest.

## 7. Default-On, User-Controlled Safety Baseline

### 7.1 Independent controls and enforcement surfaces

The policy stores explicit boolean leaves. Initial leaves are:

| Kind | Stable ID | Behavior when enabled |
|---|---|---|
| Control | `sanitation.harness` | Static harness inspection, current semantic review, changed-harness re-scan, and fail-closed verdict handling at applicable triggers. |
| Control | `drift.exact_copy` | Byte-exact duplicate checking from `.rig/sync-map.json`. |
| Control | `drift.semantic` | Host-agent review of stale/deprecated/contradictory context. |
| Control | `secrets.deterministic` | High-precision secret and tracked-`.env` checks over the applicable diff/repo scope. |
| Control | `network.action_policy` | Default-deny protected-action evaluation and permanent/one-use allowance handling. |
| Surface | `host.shell` | Mechanical enforcement at a verified shell-tool boundary. |
| Surface | `host.web` | Mechanical enforcement at a verified built-in web-tool boundary. |
| Surface | `host.mcp` | Mechanical enforcement at a verified network-capable MCP boundary. |
| Surface | `git.pre_commit` | Local pre-commit dispatcher enforcement. |
| Surface | `ci.repo` | Whole-repo CI enforcement and report upload. |

Group switches such as `sanitation`, `drift`, `host`, `all_controls`,
`all_enforcement`, and `all_baseline` are authoring conveniences. The editor
expands them to explicit leaves before writing the candidate policy; they are
not persisted precedence layers. This prevents a parent and child from
prescribing incompatible outcomes.

Control code may be materialized while dormant so a later approved policy can
enable it without fetching machinery. A disabled control is not invoked. A
disabled surface is not wired, or its previously receipt-owned adapter is
transactionally unwired while user-owned configuration remains intact.
Materialization alone never yields a protection claim.

### 7.2 Authoritative policy schema

`.rig/network-policy.json` is the sole user-owned safety authority. The
conceptual shape is:

```json
{
  "schema_version": 1,
  "enabled": true,
  "controls": {
    "enabled": true,
    "sanitation.harness": true,
    "drift.exact_copy": true,
    "drift.semantic": true,
    "secrets.deterministic": true,
    "network.action_policy": true
  },
  "enforcement": {
    "enabled": true,
    "host.shell": true,
    "host.web": true,
    "host.mcp": true,
    "git.pre_commit": true,
    "ci.repo": true
  },
  "network": {
    "enabled": true,
    "default": "deny",
    "categories": {
      "outbound_network": "deny",
      "remote_content_execution": "deny",
      "sensitive_environment_read": "deny",
      "guardrail_bypass": "deny"
    },
    "allow": []
  }
}
```

`enabled`, `controls.enabled`, `enforcement.enabled`, and `network.enabled` are
the persisted global conveniences. Effective state is the logical AND of the
applicable global switch, group switch, leaf, and surface. A false parent
preserves its child values so re-enabling restores the user's prior choices,
but every affected pair enters a fresh evidence generation. Other group
conveniences such as `drift` are editor operations that update the explicit
leaves and do not add another precedence layer.

The four protected categories apply consistently after host events are
normalized, even though two categories are broader than literal network
traffic. The frozen filename remains because the policy's primary cross-surface
purpose is network governance.

A permanent allowance names one category. The normal authoring path also binds
the surface, tool/method, operation, destination, and other applicable match
fields. The user may deliberately choose `scope: "category"` to allow that
whole category, set `enforcement.enabled` false to disable all blocking, or set
top-level `enabled` false to disable the complete Rig safety policy.
No hidden deny remains after an activated allow/disable. Narrow rules never
silently widen, and category-wide choices are visually and structurally
distinct.

If an action matches multiple protected categories, every enabled category
must be allowed. A broad allow for one category cannot bypass another.

`.rig/network-rules.md` explains categories, examples, status, and recovery.
Every installed agent pointer identifies the JSON policy as authoritative;
conflicting prose has no effect.

### 7.3 Candidate, active snapshot, and exact revision identity

The user edits `.rig/network-policy.json` as a candidate. Activation:

1. reads bounded UTF-8 bytes and rejects a BOM, duplicate keys, unknown keys,
   invalid enums, malformed matchers, and value-shaped credentials;
2. computes SHA-256 over the **exact validated bytes** without normalizing
   whitespace or key order;
3. verifies user approval of that digest, repository identity, and monotonic
   activation sequence;
4. builds one `.rig/policy/active.json` bundle containing the exact policy
   bytes (losslessly encoded) and common activation receipt;
5. fsyncs a complete temporary bundle and atomically renames it into place.

Enforcement reads only a fully valid active bundle. Editing the candidate
changes no permission until activation succeeds; the previous valid bundle
remains active and status reports `pending_activation`. Any formatting or byte
change requires a new approval. The committed bundle and signed public
`.rig/policy/trust.json` let CI verify the same revision without a private key.

Before the first user revision, the immutable shipped policy above is the safe
active default. It enables every leaf and denies every protected category. The
candidate materialized for the user begins byte-identical to that default.
There is no implicit path from an edited candidate to active permissions.

### 7.4 User-presence approval and recovery

Two approval methods produce the same receipt:

1. **Verified host-native approval, preferred.** The exact per-host contract
   must prove that the host presents the digest to the user, records affirmative
   user presence, binds repository identity and activation sequence, and emits
   a non-replayable attestation that Rig can verify.
2. **External user-presence signature, fallback.** A signer outside the target
   repository signs the versioned activation message. Rig specifies the
   interface as SSHSIG and verifies it with `ssh-keygen -Y verify` against
   `.rig/policy/allowed-signers` under a domain-separating namespace. Rig never
   invokes a signing binary and never stores private material; the user's signer
   may be any facility that produces an SSHSIG signature.

**When neither is available, activation is refused and reported unavailable.**
This is a terminal state, not a degraded success. Rig does not fall back to an
ordinary confirmation, does not record a pending activation that later
self-completes, and does not report the attempt as successful. The prior active
bundle stays in force and the candidate remains `pending_activation` with reason
`no_presence_facility`.

A refused repository is not a broken one. The shipped default policy is already
active, enables every control leaf, and denies every protected category, so the
user retains the full catalogue and the complete baseline. What they cannot do
is *loosen* anything. That is the correct failure direction, and status says so
plainly rather than implying a defect.

**The presence floor.** The default floor is hardware-attested: an
`allowed-signers` entry must be a FIDO key type (`sk-ssh-ed25519@openssh.com` or
`sk-ecdsa-*`), must not carry `no-touch-required`, and carries `verify-required`.
OpenSSH then refuses a signature that does not demonstrate user presence, so
Rig verifies presence rather than assuming it.

An ordinary key may become an allowed signer only through a one-time downgrade
ceremony authorized by a FIDO key or a verified host-native prompt. A weak signer
can never authorize its own admission. After a downgrade, every `policy status`
output names the reduced floor for the life of the install, because the
distinction between a key a human must touch and a key an agent can read is the
whole of the control, and a user who has given that up should not have to
remember it.

The downgrade allowance does **not** extend to Gate 1 integrity (D10). A signer
an agent can operate unattended would let that agent re-sign its own edits to the
acceptance oracle, which is the single case the mechanism exists to prevent.

An ordinary CLI confirmation, retyped digest, environment flag, committed
`approved=true`, unattended key available to the agent, or unverified host
prompt is not approval. A host-native mechanism that cannot attest the complete
message falls back to the external signer.

The versioned, domain-separated activation challenge binds repository identity,
exact policy digest, next monotonic sequence, previous receipt digest, a fresh
nonce, and any native expiry. After user presence and before commit, activation
re-reads and revalidates the candidate, acquires an exclusive lock, and
compare-and-swaps the previous sequence/receipt. A changed candidate or losing
concurrent activation requires a new challenge and new approval.

Signer recovery is a separate user-presence bootstrap. It invalidates pending
policy edits, one-use approvals, and current evidence epochs, and records a
recovery receipt. An agent command cannot silently reset or replace the trust
root. Tier 2 cannot withstand an OS-level adversary that can impersonate user
presence or replace the external trust facility; that ceiling is reported, not
hidden.

The committed public trust record is created by a user-present bootstrap and
bound to repository identity. Normal rotation is authorized by the old and new
credentials; lost-key recovery uses the verified provider's recovery ceremony.
Deleting the record, changing repository identity, or passing a force flag
never resets trust. If recovery is unavailable, the current active bundle
remains in force and new activation is blocked.

### 7.5 One-use approvals

A denied action may be approved once without changing the permanent policy.
The normalized envelope binds:

- active policy digest and repository identity;
- host and surface (`shell`, `web`, or `mcp`);
- matched category and rule;
- tool/server, method/operation, and destination;
- canonical repository-relative working directory;
- normalized argv or request-body digest;
- relevant file/input preimage digests;
- a remote version, ETag, or equivalent precondition when the host exposes one.

Adapters discard only documented non-semantic vendor fields such as event IDs
or timestamps. They retain the raw event digest as evidence. A changed bound
field creates a different action digest and requires new approval.

The same host-native-first/external-signature fallback approves a
domain-separated `approve-once` challenge binding policy, repository/worktree,
clone, action digest, nonce, and any native expiry. The approved envelope is
stored clone-locally under the resolved Git-path `rig/approvals/`.
It is never committed or shared. Rig imposes no clock timeout: an approval
remains pending until the action is used, a bound field changes, the user
revokes it, the active policy changes, or a verified native host expiry occurs.
`approvals list`, `revoke`, and `revoke-all` show creation age and remove
pending consent.

Before tool dispatch, the adapter acquires an exclusive consume operation and
moves the matching approval out of the pending set. Concurrent attempts allow
at most one dispatch. Consumption is final even if the tool later fails; a
retry requires new approval. A receipt is never retargeted or refreshed.

### 7.6 Common action evaluator

Every verified adapter converts its vendor event to the envelope above and
calls one dependency-free pure evaluator. Outcomes are:

- `allow_permanent`: a current narrow or explicit category-wide rule matches;
- `allow_once`: one exact pending approval was atomically consumed;
- `deny`: default/rule denial, including category, matched rule, and exact
  deliberate-proceed path;
- `disabled`: the control or surface is disabled and the action is not blocked;
- `gap`: no verified mechanical surface exists, so the installed agent rule
  remains authoritative but Rig does not claim enforcement.

Shell adapters normalize command/argv, cwd, intended environment access, and
network destination. Web adapters normalize method, URL/destination, headers
relevant to policy, body hash, and any handoff from remote content to execution.
MCP adapters normalize server, tool, transport/destination, and argument hash.
A permitted action is routed through an approved MCP tool when one can perform
it, but the MCP envelope is evaluated again; routing never bypasses policy.

Every denial names the category and rule. Legitimate near-matches pass.
Unsupported or incomplete adapters emit no hook/config. The instruction rule
still requires policy compliance and status reports the mechanical gap.

### 7.7 Sanitation and bounded remediation

When `sanitation.harness` is enabled, the accepted review and harness digest are
installed under `.rig/baseline/`. Adopt-time, on-demand, changed-harness
pre-commit, and enabled CI triggers use the same bounded static detector;
semantic review maps only to `ALLOW`, `ALLOW_WITH_RESTRICTIONS`, `QUARANTINE`,
or `BLOCK`. A changed harness digest makes prior evidence stale. Unambiguous
findings block; uncertainty/unverifiable input quarantines.

When disabled, those triggers do not restrict onboarding or work. No verdict is
created or reused, and status records `disabled`/`not_run`.

Remediation proposal generation is read-only. A proposal contains only typed
operations, exact target paths, input preimages, expected output hashes, and the
complete expected diff. Applying it requires user-presence approval of the
exact proposal digest. Apply rechecks all preimages, rejects stale or empty/no-op
work, uses the normal exclusive transaction/rollback path, and rejects any
observed write outside or different from the approved diff. Any partial write
or verification failure rolls back. After an exact successful write set, Rig
runs sanitation again and publishes only that fresh result.

### 7.8 Drift and secret controls

`.rig/baseline/drift-rule.md` tells the host agent to update central context,
point secondary contexts to central sources, register unavoidable byte
duplicates, and report uncertain semantic drift instead of rewriting intent.
The repo's documents are the memory; there is no hidden learning store.

When `drift.exact_copy` is enabled, `.rig/bin/check-copies.js` canonicalizes
paths below the repo, rejects missing/escaping files, compares bytes, emits
minimal context, and returns nonzero on drift at each enabled git/CI surface.

When `drift.semantic` is enabled, the verified host reviewer compares
`.rig/context-index.json`, changed files, canonical/deprecated relationships,
and current input digests. Missing, malformed, stale, or note-only reviewer
output is a gap, never a pass.

When `secrets.deterministic` is enabled, the dispatcher runs the high-precision
patterns and tracked-`.env` block over staged or whole-repo scope as applicable.
This control is independent from the selected Product-Security leak-scanner
service.

First enabling that service enters `pending_history_scan`. Rig discovers a
configured vetted scanner and runs its documented full-history mode with
`shell: false`. A clean run activates the service. A finding, missing scanner,
unsupported version, timeout, malformed output, concurrent history/config
change, or execution failure is nonzero and writes an actionable redacted
report. Before and after execution Rig compares a digest of all reachable Git
objects/refs plus scanner configuration; a change makes the result stale.

A waiver is available only for an actual current finding set. It must be
user-approved and bound to exact scanner/version, repository/ref state,
configuration, and finding-set digest. Missing/broken scanners have no finding
set and cannot be waived. Remediation requires a clean re-scan or that exact
waiver; the deterministic staged control remains independently governed by
policy.

### 7.9 Git/CI dispatch and truthful evidence

For each trigger, a control runs only when both its leaf and the enforcement
surface are enabled. The pre-commit order is:

1. changed-harness sanitation;
2. exact-copy drift;
3. deterministic staged-secret checks;
4. selected Product-Security checks;
5. the preserved user hook.

`.rig/bin/check.js --scope repo` runs all enabled repo-applicable controls and
selected executable services in dependency order. Disabled leaves/surfaces are
listed as disabled/unrun; they do not execute and do not block. Failure in a
Rig check does not suppress the preserved user hook unless the approved
fail-fast contract explicitly says the commit is already denied.

Every result is bound to `control_id`, `surface_id`, active policy digest,
enablement generation, implementation digest, and input digest. Disablement
invalidates the current generation. Re-enablement creates a new generation and
status remains `pending`/`not_run` until fresh evidence exists. Allowed status
states are `disabled`, `not_run`, `pending`, `coverage_gap`, `failed`, and
`verified`. None may be relabeled as protected/scanned/passed/verified without
current-epoch evidence.

## 8. Runnable Services and Reports

### 8.1 Binding schema

Bindings use argv arrays:

```json
{
  "testing.unit.test-case-generation": {
    "disposition": "executable",
    "discovered_from": "package.json:scripts.test",
    "diff": ["npm", "test", "--", "--changed"],
    "repo": ["npm", "test"],
    "timeout_ms": 600000,
    "binding_digest": "<sha256>"
  }
}
```

No binding is executed during inspection, recommendation, planning, or apply.
Execution uses `spawnSync(command, argv, { shell: false })` with an explicit
working directory and timeout. Unknown executables, missing bindings, timeouts,
malformed output, known generic-success stubs, and processes that were never
launched are coverage gaps or failures, never green passes. The runner iterates
the selected service receipt, not the binding keys, so a missing binding cannot
disappear through omission.

Convention dispositions name an installed-state verifier in the same receipt;
they do not receive argv. Surfaceless dispositions name their predicate and
specific reason. The source-side CLI and materialized `.rig/bin/check.js` share
one generated runner contract and fixtures so local and CI behavior cannot
diverge or silently skip different cases.

### 8.2 Run scope

- Development/pre-commit defaults to changed files or the staged diff.
- CI uses whole-repo scope.
- The testing ladder is fail-fast. A failed earlier rung marks later rungs
  `not_run_due_to_dependency` in the failing report rather than pretending they
  passed.
- Only declared surfaceless services whose predicate holds exit successfully
  with a `vacuous` report containing the exact reason. An executable service
  lacking a surface/binding is a nonzero `coverage_gap`.

### 8.3 Report schema

Required fields:

```json
{
  "schema_version": 1,
  "run_id": "<content-safe id>",
  "service_id": "testing.e2e.browser-automation",
  "grade": "maximal",
  "effective_slices": [],
  "scope": "diff",
  "status": "vacuous",
  "summary": "Nothing to pin here.",
  "reason": "No browser or UI surface was detected.",
  "evidence": [],
  "fix_context": [],
  "rerun": ["node", ".rig/bin/check.js", "--service", "...", "--scope", "diff"]
}
```

Run-report status values written to disk are `failed`, `vacuous`, and
`coverage_gap`. Control/policy status separately records `disabled`, `not_run`,
`pending`, and evidence-stale states required by Section 7.9. Routine
current-epoch pass reports are omitted. CI uploads `reports/rig/` as artifacts.
Local report names use a timestamp plus content hash and exclusive creation to
avoid concurrent writers.

Security findings use the same evidence/fix-context conventions plus the
frozen verdict enum. All secret-shaped evidence is redacted before writing.

## 9. Trust, Safety, and Failure Boundaries

| Boundary | Required behavior |
|---|---|
| Target path | Realpath beneath target; reject traversal and escaping symlinks. |
| `rig.json` | Strict object/enum/ID validation; reject unknown service, grade, host, and value-shaped credential. |
| Candidate policy | Bounded exact bytes; strict duplicate/unknown-key/schema rejection; never used for enforcement until approved. |
| Active policy | Exact snapshot digest, repository/sequence-bound verified attestation or signature, atomic receipt last; fail closed on missing/stale/replay. |
| User-presence trust | Verified host attestation or external signer outside the repo; repo flags, TTY text, and unattended keys are insufficient. |
| One-use approval | Clone-local, complete action binding, exclusive atomic consumption before dispatch, no retarget/replay/share. |
| Host action event | Axis-specific schema validation and normalization; malformed/unknown event is a gap/deny according to the verified contract, never implicit allow. |
| Source fragments | Catalogue allowlist only; verify source catalogue digest before use. |
| Harness scan | Read as bytes; never execute/import/source; bounded size and redacted evidence. |
| Review artifact | Strict schema, current harness digest, fail closed on missing/unverifiable data. |
| Dependency graph | Valid target/slice, acyclic, deterministic fixed point. |
| User files | No replacement/deletion; malformed structured config blocks. |
| Commands | Argv arrays, `shell:false`, timeout, explicit cwd, no scan-time execution. |
| Service binding | Explicit disposition; discovered executable and real launch evidence; missing/malformed/no-op/silent binding is nonzero. |
| Remediation | Read-only exact proposal, user-presence approval, preimage CAS, transactional observed-diff equality, no-op rejection, rollback, fresh sanitation. |
| CI config | Provider-native verified parser/adapter, namespaced additive ownership, exact plan approval, collision refusal, least privilege, real first wire. |
| Reports | Repo-local, schema-validated, redacted, no telemetry. |
| Concurrent apply | Exclusive lock plus before-hash compare-and-swap. |
| Partial failure | Roll back current transaction; keep prior receipt/install intact. |
| User-global file | Append or namespaced additive merge only; every pre-existing value survives byte-for-byte; entries attributed to the writing repository from the first install; removal touches only this repository's entries. |
| Install identity | Generated, clone-local, never committed; a linked worktree is a distinct installation. |
| Gate 1 integrity | Recomputed digests plus a namespaced SSHSIG signature from a hardware-presence key; fail closed on a missing, invalid, or weak-signer signature. No git dependency. |
| Claim status | Declared field and evidence bundle must agree; disagreement in either direction fails the gate. |
| Install stub | Fetches a released tag by name; downloads to a file before executing; never pipes network output to a shell. |

No network access is required for onboarding mechanics. A selected service may
later call an existing repo tool that uses network access, but its shell/web/MCP
action is normalized and evaluated like any other action. A service convention
cannot bypass the active policy or substitute its own approval semantics.

## 10. Host and CI Coverage

### 10.1 Host contracts

The initial roster is exactly:

`claude`, `codex`, `cursor`, `windsurf`, `cline`, `kiro`, `gemini`, `copilot`,
`opencode`, `pi`, `hermes`, `copilot-cli`, `antigravity`, `codewhale`,
`openclaw`, `devin`, `swival`, `vscode-codex`, and `generic`.

Host identity remains `devin` = Devin CLI and `windsurf` = Devin Desktop
(formerly Windsurf); Cloud Devin is out of scope. The registry replaces the
coarse aggregate `live_hook` claim with axis-local entries for `instruction`,
`native_skill`, `shell_hook`, `web_hook`, `mcp_hook`, and `mcp_config`. Git and
CI remain separate deterministic surfaces.

Every axis carries exactly one status:

| Status | Built and emitted? | Advertised? | Release-blocking? |
|---|---|---|---|
| `verified` | yes | yes, as verified | yes — a gap in its bundle blocks release |
| `emitted` | yes | yes, as unverified, per §6.5 | no |
| `unsupported` | no, and says why | no | no |
| `advisory` | instruction only | no | no |

`verified` and `emitted` are both **built**. The difference is the claim, not
the delivery: an `emitted` axis receives the same adapter and the same
configuration a `verified` one does, and its user gets the same product. What
they do not get is a promise that anyone has watched it work.

There is no `incomplete` status. A half-authored bundle does not quietly demote
itself to `emitted` — it fails the specification gate, because silent demotion
would turn the release gate into a formality that always passes. This is why
status is a declared field cross-checked against evidence rather than derived
from evidence alone (AD-13): derivation cannot distinguish "we have not wired
this yet" from "someone left this bundle half-written."

The cross-check runs in both directions. A `verified` axis whose bundle is
incomplete or stale fails. A complete, valid, first-wired bundle sitting at
`emitted` also fails, because that is a claim Rig has earned and withheld, and
letting the two disagree lets them drift.

Nothing anywhere enumerates the advertised hosts. The initially advertised set —
Claude Code, Cursor, Codex, GitHub Actions — is an *outcome* of which bundles are
complete, never a declaration. Promotion flips one axis's own `status` field
beside its new evidence, touches no list, and requires no Gate 1 edit, which is
`AT-HOST-4`'s explicit requirement.

A `verified` axis's Gate-2 contract contains:

```json
{
  "host": "gemini",
  "axis": "shell_hook",
  "status": "verified",
  "emission": {
    "path": ".gemini/settings.json",
    "format": "json",
    "owned_namespace": "<exact namespace>",
    "first_apply": "<exact additive behavior>",
    "repeat_apply": "<exact idempotent behavior>",
    "preserve": "<exact user-config rule>"
  },
  "input": {
    "event": "<vendor event name>",
    "schema_version": "<vendor/version>",
    "matcher_fields": ["<exact fields>"]
  },
  "deny": {
    "payload": "<exact vendor response>",
    "exit_or_process_behavior": "<exact behavior>",
    "category_field": "<field>",
    "rule_field": "<field>"
  },
  "proceed": {
    "native_user_presence": "<exact verified protocol or null>",
    "external_signature_fallback": "<exact adapter handoff>"
  },
  "evidence": {
    "vendor": "<vendor>",
    "version": "<verified version>",
    "verified_on": "YYYY-MM-DD",
    "official_citation": "<exact surface/behavior URL>",
    "adapter_digest": "<sha256>",
    "fixture_digest": "<sha256>",
    "first_wire": {
      "run_id": "<real run>",
      "run_date": "YYYY-MM-DD",
      "result": "pass",
      "evidence_digest": "<sha256>"
    }
  }
}
```

Rules:

- official documentation **and** a successful first wire are both required for
  every `verified` axis; one cannot substitute for the other;
- evidence is owned by one `{host, axis}` pair and cannot be reused as a
  host-level umbrella citation;
- adapter/config byte changes invalidate the first-wire receipt;
- an incomplete or stale bundle on a `verified` axis fails the specification
  gate and blocks release. It does not fall back to `emitted`;
- an `emitted` axis still emits its adapter and configuration, and is disclosed
  under §6.5. It is never skipped, silently or otherwise, on the grounds that
  its enforcement is unproven;
- genuine vendor absence is `unsupported` or `advisory`, cites the absence, and
  emits no speculative config. This is the only status permitted to emit
  nothing;
- `mcp_config` additionally records `repo`, `user_global`, or `unsupported`.
  User-global is advisory only; a fabricated repo path is forbidden;
- `pi` MCP is `unsupported` in both catalogue and legacy Basic paths. Fresh
  installs emit no `.omp/mcp.json`. Existing user-owned content is preserved
  byte-for-byte and receives migration guidance rather than deletion;
- every instruction-capable host receives pointers to the catalogue router and
  policy/guide; no host receives a Rig model key.

The current registry's aggregate citations and
`.rig/hooks/semantic-review.hint.md` markers do **not** satisfy this contract.
As of this v0.3 candidate, no host axis holds a complete bundle, so every axis
starts at `emitted` and the advertised set is empty. Release requires the four
initially advertised axes to reach `verified` with complete contracts and real
first wires recorded in this authority; the remaining axes ship `emitted` and
disclosed, and promote later without touching Gate 1. Subordinate coverage
reports may supply evidence, but cannot promote an axis themselves.

Host tests exercise each verified adapter's real event fixture, normalized
policy decision, deny/proceed response, preservation boundary, and first and
repeated apply. The common service payload remains centralized, so those tests
do not duplicate all 115 service assertions.

### 10.2 CI provider, integration, and bootstrap contracts

The initial provider roster is exactly `github-actions`, `gitlab_ci`,
`circleci`, `jenkins`, `buildkite`, and `azure_pipelines`. Each provider uses
the same axis-local contract/evidence rule as executable host adapters:
provider/version, exact config paths and schemas, owned merge boundary,
collision behavior, minimum permissions, report-upload form, first/repeated
apply, official documentation, adapter/fixture digests, and a real first-wire
run.

CI detection yields one of:

- `verified_existing`: a supported provider config parsed by its exact adapter;
- `absent`: no provider config detected;
- `unknown`: a config exists but no verified adapter owns its shape;
- `malformed`: the matching provider config cannot be safely parsed;
- `collision`: Rig's standalone path/namespace is already user-owned.

For `verified_existing`, the content-bound plan adds one namespaced Rig job or
step that runs `.rig/bin/check.js --scope repo` and uploads actionable
`reports/rig/` output. The merge preserves all unrelated jobs, values,
permissions, comments/format where the verified adapter contract promises
them, and user secrets. Apply requires exact plan approval and is idempotent.

For `absent`, Rig does not guess a provider and plan writes nothing until the
user explicitly selects one of the six verified providers. The resulting
minimal provider-native pipeline requires exact plan approval before creation.
It requests only documented minimum permissions, references no repository
secrets, runs all enabled repo-applicable controls and selected executable
services, and uploads actionable reports.

`unknown`, `malformed`, and `collision` return nonzero, record the exact reason,
and preserve every byte. They never degrade to advisory success or emit a
nearby speculative file.

Every new or merged target integration begins
`installed_pending_first_wire`. Its real provider run emits an evidence artifact
bound to provider, config digest, adapter version, commit, active policy,
effective binding manifest, run ID/URL, and Rig job result. Only a successful
real run promotes the target integration to `verified`; a render test, local
fixture, or advisory note cannot. Provider adapters themselves also remain
incomplete for product release until their source-side first-wire evidence is
recorded in this authority.

Disabling `ci.repo` transactionally removes or disables only the receipt-owned
Rig integration. User jobs/config remain unchanged. Any external branch rule
that still requires the old Rig job is outside repository control and is
reported as a remaining enforcement dependency rather than silently modified.

## 11. Compatibility and Rollout

### 11.1 Legacy CLI

No-subcommand legacy invocation follows the current Basic code path and keeps
its acceptance tests green. Catalogue manifests are identified by
`schema_version` and used only with new subcommands.

### 11.2 Existing Basic target

Adoption order:

1. read the Basic receipt if present;
2. compare legacy payload candidates against shipped byte digests;
3. adopt only proven Rig-owned entries;
4. treat everything else as user-owned;
5. strictly parse and preflight existing host configs, then call existing MCP
   renderer shapes only through the Infrastructure compatibility slice and
   never for an `unsupported` host such as `pi`;
6. preserve a pre-existing user-owned unsupported MCP file and emit migration
   guidance; remove only receipt-proven Rig-owned entries through an explicitly
   approved migration;
7. establish the safe default policy/active snapshot without treating legacy
   config as a user approval;
8. write the new catalogue receipt without deleting the Basic receipt.

There is no automatic destructive migration. The catalogue path never reaches
the legacy renderers' malformed-JSON fallback.

### 11.3 Release gate

The catalogue path is not advertised as supported until the gates pass in this
order:

1. `technical-spec.md` is the sole frozen Gate-2 authority and pins the current
   Gate-1 digests;
2. traceability covers the exact Gate-1 ID set and every row names a testable
   mechanism and executable target;
3. placeholder/contradiction checks and a fresh-context exact-digest semantic
   review pass with no unresolved item;
4. all 115 service leaves pass mechanical authorship checks and the separate
   fresh-context per-leaf semantic/MECE review;
5. every advertised executable host/CI axis has its complete exact contract,
   official evidence, and successful first wire;
6. all Gate-1-derived executable acceptance tests pass, including policy,
   approval, binding, history, remediation, host, and CI cases;
7. legacy Basic and Tier 1 suites remain green;
8. `npm test` passes on the same final source state.

Release blocks on the **advertised** set, not the built set. An axis that is
built, emitted, and honestly disclosed does not block release; an axis
advertised as `verified` without a complete contract, official evidence, and a
passing first wire does. Only evidence-backed genuine vendor absence degrades
explicitly without speculative output.

The distinction this gate exists to protect is between "we installed this" and
"we have seen this work." Everything else in §11.3 is machinery for keeping
those two sentences apart.

### 11.4 Distribution

A stranger with `git`, `curl`, and `sh` and no checkout must be able to install
Rig. Correctness without a delivery path is not a shipped product, and the
readiness audit found no delivery path existed.

**The stub.** `install.sh` is committed at the repository root. A stranger
fetches it at a released tag and runs it. It resolves a released version tag
from GitHub by name, defaulting to the latest release, and accepts an override
for a specific one.

It does not embed a build fingerprint. A fingerprint only helps when it is
harder to tamper with than what it fingerprints, and the stub and the source are
served from the same repository — anyone able to re-point a tag can equally edit
the constant sitting beside it. Guarding against accidental retagging is a
repository setting (tag protection), not installer machinery, and Rig does not
reimplement version control inside a shell script.

**The stub never pipes the network into a shell.** It is downloaded to a file
and then executed. Rig's own default policy denies `remote_content_execution`,
and an installer that violates the product's own rule in its first five seconds
cannot be defended to the user it is about to lecture.

`AT-DIST-1`'s "pinned source reference" is satisfied by a released tag. The
failure it forbids is installing from a moving branch, which would hand a
stranger half-finished work.

**Release plumbing.** The inherited npm publish workflow is deleted: the package
is `private`, so tagging a release would otherwise fail on a publish step that
was never going to succeed. `package.json` moves to `5.0.0` and stays `private`.
The repository's default branch is `prod`; no workflow may reference `main` or
`master`.

## 12. Acceptance Traceability

The specification gate extracts the distinct acceptance IDs from Gate 1 and
requires exact set equality with the primary rows below, currently **45 IDs**.
Every row must name an existing design anchor and a substantive executable test
title containing the same ID. Explicit evidence aliases are permitted only for
Gate-1 properties that point to another case; tautological assertions are not.

Set equality is asserted against Gate 1 as read from disk, not against a number
written here. The count above is documentation; if it disagrees with the file,
the file wins and the gate fails.

| Gate 1 case | Design mechanism | Primary executable evidence |
|---|---|---|
| AT-GATE-1 | This file is the only document with role `gate2-authority`; current SOW/task/coverage files are explicitly subordinate and every copied mechanism traces to an AD/section anchor. | `advanced-spec-gate.test.js`: reject a second authority, orphan normative ruling, or invalid anchor; accept the real tree only when authority is singular. |
| AT-GATE-2 | The spec gate is the first element of `npm test` and short-circuits the code tests with `&&`; it requires status `FROZEN`, current Gate-1 digests, complete traceability, no unresolved mechanism markers, and a current semantic-review receipt. Its **first** check (AD-28) recomputes both Gate-1 digests and verifies the namespaced SSHSIG signature from a hardware-presence key. The gate has no exemption, skip, or progress input. | Prove open, contradictory, incomplete, and unreviewed spec fixtures short-circuit before an executable code-test sentinel ever runs. Separately mutate one Gate-1 byte and prove the signature check fails; re-sign with a non-FIDO key and prove it still fails. |
| AT-GATE-3 | A fresh-context report-only review receipt binds exact Gate-1/Gate-2 digests and records one testability/conflict verdict per Gate-1 ID with `unresolved=[]`. Per AD-29 the receipt's model ID, digest, and timestamp are written by the invoking wrapper, not the reviewing agent, and the wrapper refuses to run under the model named in this file's authoring-context block. | Reject stale digests, missing IDs/anchors/targets, conflicts, same-context review, and a receipt whose model matches the authoring model; prove the agent cannot author its own model/digest fields. |
| AT-GATE-4 | Workflow receipts record distinct implementation and review context/run IDs, not named staff; implementation diffs cannot change pinned Gate 1 or self-approve. | Accept one maintainer with distinct contexts; reject identical implementer/reviewer context and changed Gate-1 digests. |
| AT-SHAPE-1 | All leaves/grades use the typed ownership/CAS/rollback graft path; no pack can bypass it. | Iterate 115 leaves x 3 grades against seeded user instructions/config; preserve bytes/keys and prove idempotent repeat apply. |
| AT-SHAPE-2 | Recommendation emits every leaf but resolution consumes only user-confirmed `rig.json`. | A UI-less library marks E2E not recommended, then user selection still plans/applies it. |
| AT-SHAPE-3 | Identity is grade-invariant; fragments/check sets are strict cumulative supersets. | Catalogue-wide 115-leaf grade set and identity test. |
| AT-SHAPE-4 | Deterministic named-slice fixed point preserves explicit grades and cannot represent whole-group pulls. | Missing/lower-grade/transitive/cycle fixtures prove only exact slices are added. |
| AT-SHAPE-5 | Executable is the default disposition and is attempted first (AD-15); `convention` is a fallback that must carry a service-specific named reason, and only `surfaceless` may be vacuous. | Inject failing real process, convention verifier, valid vacuity, and missing/empty/`true`/`echo`/`process.exit(0)` bindings; separately prove a convention whose reason is generic, absent, or byte-repeated across services scores as a coverage gap. |
| AT-SHAPE-6 | Section 4.6 authored fields, anti-filler gate, exact 26/40/31/18 inventory, and fresh 115-leaf semantic-review receipt. | Reject TODO/generic/repeated/missing content and stale/incomplete review receipts; each leaf has one semantic verdict. |
| AT-BASE-1 | Safe shipped policy runs sanitation first; an exactly activated disablement continues with disabled/not-run state and no verdict. | Prove default ordering and separately prove approved disablement unlocks menu without clean/protected evidence. |
| AT-BASE-2 | One evaluator and action envelope govern verified shell/web/MCP adapters; unsupported surfaces are explicit gaps and MCP is re-evaluated after preferred routing. | Equivalent allow/deny actions across all three surfaces plus unsupported-axis and no-MCP-bypass fixtures. |
| AT-BASE-3 | Install authoritative `.rig/network-policy.json`, explanatory `.rig/network-rules.md`, and pointers to both; enforcement reads active JSON only. | Conflicting prose cannot change a decision; every host instruction locates both artifacts. |
| AT-BASE-4 | Sections 7.3/7.4 exact-byte digest, active snapshot, verified host-native or external user-presence approval, repository/sequence binding, and replay rejection. | Accept both verified paths; reject byte edits, wrong repo/sequence, copied receipt, invalid signature, unverified prompt, and unsigned candidate. |
| AT-BASE-5 | Explicit independent control/surface leaves, group/global authoring expansion, actual unwiring/non-blocking, unrelated function continuity, and truthful status. | Disable one control, one surface, one category, then all enforcement; verify requested effects and every status label. |
| AT-BASE-6 | Evidence keys include policy digest, control/surface, enablement generation, implementation, and inputs; disable invalidates and re-enable increments. | A pre-disable pass cannot verify the re-enabled generation until a fresh run completes. |
| AT-P1 | Same exhaustive typed graft evidence as AT-SHAPE-1; aliases must resolve to its real parameterized test. | `AT-P1` evidence alias to the substantive AT-SHAPE-1 test, never a tautological assertion. |
| AT-P2 | Aggregate safe-default, exact activation, disablement, cross-surface enforcement, truthful status, and re-enable behavior from AT-BASE-1..6. | One aggregate scenario invokes substantive baseline cases; no string-equality placeholder. |
| AT-P3 | Global `owns` uniqueness, authored adjacent exclusions, frozen perf/load and secret-injection boundaries, plus semantic MECE receipt. | Exact scope-map tests and per-adjacent-pair `mece=pass` at current catalogue digest. |
| AT-P4 | Build/claim split: the whole matrix is emitted (AT-CLAIM-1), only bundle-complete cells are `verified` (AT-HOST-4), and the difference is disclosed (AT-CLAIM-2). Genuine absence degrades only explicitly. | Iterate every host axis/provider: reject a skipped cell, a speculative emission, shared evidence, a `verified` cell with a partial bundle, and a complete bundle left at `emitted`. |
| AT-P5 | `rig.json` owns selection; activated policy owns permissions; planning/apply bind both exact digests and defaults never override either. | Override recommendation/grade and default deny, then verify install and enforcement follow the user choices. |
| AT-P6 | Authored-service gate plus executable-first honest disposition runner (AD-15); inventory alone cannot pass. | Iterate all 115 leaves, execute each declared evidence target or valid surfaceless predicate, and prove every convention-only fallback carries a service-specific named reason. |
| AT-B1 | Enabled exact-copy control runs byte checker at enabled git/CI surfaces; approved disablement stops it and reports disabled. | Drift duplicate under both scopes, then disable only that control without affecting others. |
| AT-B2 | Enabled semantic control requires current schema-validated host review over index, changes, aliases, and input digests. | Non-identical stale context fails; missing/stale/note-only reviewer output is a gap. |
| AT-B3 | Vetted external scanner, documented full-history argv, pending activation, clean/finding/missing/error handling, exact-finding waiver, and staged-control independence. | Fake vetted executables prove actual full-history invocation, all failure paths, clean activation, waiver binding, and post-remediation re-scan. |
| AT-B4 | Enabled pre-commit dispatcher invokes the real bounded sanitation detector over staged harness/config bytes. | Stage malicious `AGENTS.md`, spy on input hashes, and reject a note-only result. |
| AT-B5 | Exact four-verdict mapping, blocker/uncertainty precedence, freshness validation, and no verdict when disabled. | Cover all verdicts, malformed/stale review, deterministic blocker, uncertainty, and disabled path. |
| AT-B6 | Read-only typed proposal, exact user-presence approval, preimage CAS, no-op rejection, transactional exact-diff verification/rollback, and fresh re-scan. | Wrong/stale/no-op, exact success, injected partial failure, unapproved extra write, observed-diff mismatch, and fresh sanitation fixtures. |
| AT-B7 | Diff development scope, repo CI scope, dependency-order fail-fast, shared runner, and actionable failed/vacuous/gap reports. | Prove distinct inputs, dependency-not-run, report contents/upload, visible gaps/vacuity, and omitted routine passes. |
| AT-HOST-1 | Section 10.1 complete per-axis emission/event/matcher/deny/proceed/merge/preservation/idempotence contract. | Validate every field and real event plus first/repeated apply for each verified axis. |
| AT-HOST-2 | Common evaluator denies four categories, names rule/category, passes near-matches, consumes exact one-use once, and honors activated permanent choices. | Cross-adapter deny/near-match plus changed/replayed/concurrent/failed-dispatch/revoked/native-expired one-use and narrow/category-wide permanent fixtures. |
| AT-HOST-3 | Evidence is axis-local and includes exact official citation, vendor/version/date, adapter/fixture digest, and real first wire. An axis without a bundle is `emitted`, not exempt from being built. | Mutate each field, share one bundle, or stale the adapter digest; `verified` must be lost — and the axis must still emit its configuration afterwards. |
| AT-HOST-4 | Release blocks on the advertised set only. `status` is declared per `{host, axis}` and cross-checked against its bundle in both directions (AD-13). No file enumerates the advertised hosts. | Turn each contract/evidence/first-wire field missing in turn across the whole matrix; prove release blocks only for `verified` cells. Separately grep the tree for a hard-coded four-host list and fail if one exists, then add a first-wire bundle and prove promotion needs no Gate 1 edit. |
| AT-HOST-5 | Shared MCP disposition governs legacy/catalogue; unsupported `pi` emits nothing; user-owned old file survives with guidance. | Fresh/adopt/upgrade through both entrypoints; zero new config and byte-identical seeded user file. |
| AT-CI-1 | Exact provider adapter additively merges one Rig gate/upload into verified existing CI under plan approval. | Seed all six provider configs and deep-compare every unrelated user value after integration. |
| AT-CI-2 | Absent CI creates nothing until explicit verified-provider selection and exact plan approval. | No-choice/wrong-approval cases write nothing; each verified choice creates only its minimal native pipeline. |
| AT-CI-3 | CI runs all enabled repo controls/services, uploads reports, requests minimum permissions, uses no repo secrets, and repeats idempotently. | Parse/execute all six outputs; check effective binding manifest, permissions, no secrets, upload, and zero second-apply diff. |
| AT-CI-4 | Unknown/malformed/collision config is byte-preserved/nonzero; target integration stays pending until a real provider-run receipt bound to exact config/commit/adapter/policy succeeds. | Reject fabricated/stale/local-only receipts and validate captured successful first-wire fixtures for every emitted provider integration. |
| AT-CLAIM-1 | §10.1 status table: `verified` and `emitted` are both built and emitted; only evidence-backed `unsupported`/`advisory` may emit nothing. No code path skips a host for lack of verification. | Install on all 19 hosts and all six providers with an empty advertised set; assert every host receives its configuration and none is skipped. Assert the emitted byte set for an `emitted` axis equals the set it would receive as `verified`. |
| AT-CLAIM-2 | §6.5 claim line in install output and every run report, naming status in user-facing words and disclosing any out-of-repo write. | Capture install output and a run report per host; assert an exact status phrase for each and assert a user-global write is named. A host present in the install with no claim line fails. |
| AT-CLAIM-3 | §6.5: no prompt, flag, or acknowledgement on the unverified path. | Drive install and run non-interactively on an `emitted` host with stdin closed; assert completion with no prompt and no extra argument. Diff the invocation surface of an `emitted` host against a `verified` one and assert equality. |
| AT-PRESENCE-1 | §7.4 three terminal states: host-native, external SSHSIG, or refusal reported unavailable. FIDO floor with a FIDO-authorized downgrade ceremony; Rig verifies and never signs. | Activate via each available path; then remove both facilities and assert refusal with reason `no_presence_facility`, prior bundle still active, and no success recorded. Assert a plain key is rejected before the ceremony and disclosed in status after it. Assert no signing binary ships and no private key material is written. |
| AT-HOME-1 | §6.4 append or namespaced additive merge only, with §6.5 disclosure. | Seed a user-global file with hand-written values, install, and assert byte-for-byte survival of every pre-existing value plus a disclosure line. A wholesale rewrite or an undisclosed write fails. |
| AT-HOME-2 | §6.4 attribution by clone-local install ID from the first install, with `.rig/global-writes.json` as the removal ledger. | Install from repo A and repo B into one global file; uninstall A and assert only A's entries are gone, B's and all unattributed values survive byte-for-byte, and B still works. Reinstall A twice and assert idempotence. Assert the removal report names A and not B. Assert the *first* install's entries are attributed before any second repository exists. |
| AT-DIST-1 | §11.4 committed root install stub fetching a released tag by name; `publish.yml` deleted; `package.json` at `5.0.0`, private. | In a container with only git, curl and sh and no checkout, run the stub against an empty repo and assert a working install. Assert the stub never pipes to a shell. Assert no publish workflow exists and that tagging `v5.0.0` cannot invoke npm publish. |

The specification gate also:

0. **first**, recomputes the SHA-256 of `business-spec.md` and `acceptance.md`,
   rebuilds the `rig-gate1-freeze-v1` message, and verifies its SSHSIG signature
   in namespace `rig-gate1` against `.rig/policy/allowed-signers`, requiring a
   hardware-presence key. Every later check is meaningless if Gate 1 has moved,
   so nothing else runs until this passes;
1. confirms those digests match the pins recorded in this file's header;
2. rejects a second Gate-2 authority or a subordinate superseding mechanism;
3. rejects unresolved mechanism markers and forbidden catalogue filler;
4. compares Gate-1 IDs, trace rows, and executable test titles for exact
   coverage, reading the ID set from Gate 1 rather than from a written count;
5. validates exact-digest fresh-context Gate-2 and 115-leaf catalogue review
   receipts, including that each receipt's wrapper-written model differs from
   this file's declared authoring model;
6. runs before all code correctness tests and short-circuits their promotion on
   failure.

It does **not** consult git for any of this. There is no upstream comparison, no
branch-protection requirement, and no notion of a "reviewed commit" anywhere in
the gate (GA-11).

## 13. Ordered Tracer-Bullet Slices

All slices below are pending under Gate 1 dated 2026-07-26 at 45 cases. Existing
code may be reused only after its current behavior passes the revised test —
roughly 1,450 lines of `rig/lib` Advanced modules and 19 test files exist from
the withdrawn design and are reusable spine, not reusable evidence. Each slice
leaves one runnable check and keeps all prior checks green.

**`npm test` is red from Slice 1 until Slice 14, by construction.** The
specification gate runs first and fails while Gate 2 is a candidate, so the code
tests never execute. That is `AT-GATE-2` working, not a defect. `npm run
test:code` runs the code tests alone and is the signal to watch during the
build; it is expected green continuously. Feature-branch pushes may go out with
`npm test` red. Merging to `prod` may not.

### Slice 1 - Specification authority and complete executable oracle

Implement the Section 12 specification gate with the Gate-1 signature check
first, pin the Gate-1 digests, transcribe all **45** IDs into substantive tests,
and remove or rewrite the obsolete tests that assert a non-disableable baseline
or tautological aliases. Add `npm run test:code`; wire the gate ahead of the
code tests in `npm test`. Do not edit Gate 1.

This slice includes the one manual step in the project: once the verifier
exists, the intent owner signs the frozen Gate-1 message with a FIDO key. Until
that signature exists the gate cannot pass, by design.

Verification:

```sh
node scripts/check-advanced-spec.js
node --test tests/advanced-spec-gate.test.js tests/advanced-acceptance.test.js
```

The code gate remains intentionally red after this slice.

### Slice 2 - Catalogue disposition and authored-content gate

Add explicit executable/convention/surfaceless metadata, real evidence targets,
anti-filler/duplicate checks, exact inventory counts, and the exact-digest
per-leaf semantic review schema. Keep all unauthored leaves red.

Verification:

```sh
node --test tests/advanced-catalogue.test.js tests/advanced-services.test.js
```

### Slice 3 - Policy parsing, active bundle, and truthful status

Implement strict bounded policy parsing, exact-byte digest, shipped safe
default, candidate/active separation, committed trust/active bundle validation,
independent effective switches, evidence generations, and status. Remove
`rig.json` baseline rejection without accepting policy keys there.

Verification:

```sh
node --test tests/advanced-policy.test.js tests/advanced-config.test.js
```

### Slice 4 - User-presence and one-use approval lifecycle

Implement verified host-native-first/external-signature fallback, common
receipts, bootstrap/rotation/recovery, clone/worktree-local approval storage,
full action normalization, exclusive consumption, list/revoke, and native
expiry handling. Repository/TTY self-authorization remains impossible.

Verification:

```sh
node --test tests/advanced-policy.test.js tests/advanced-enforcement.test.js
```

### Slice 5 - Cross-surface evaluator and policy-aware onboarding

Implement one pure evaluator and representative verified shell/web/MCP adapter
fixtures, denial/proceed payloads, permanent narrow/category choices, preferred
MCP rerouting as a separately evaluated action, safe-default sanitation order,
approved sanitation disablement, and truthful gaps.

Verification:

```sh
node --test tests/advanced-enforcement.test.js tests/advanced-policy.test.js tests/advanced-recommend.test.js
```

### Slice 6 - Real sanitation remediation and policy-aware transaction

Extend the existing plan/apply spine with exact plan approval, policy/adapters,
control wiring/unwiring, real read-only remediation proposals, preimage CAS,
no-op rejection, observed-diff equality, rollback, and fresh sanitation.

Verification:

```sh
node --test tests/advanced-plan.test.js tests/advanced-apply.test.js tests/advanced-graft.test.js tests/advanced-remediation.test.js
```

### Slice 7 - Policy-aware git/CI controls and evidence epochs

Run changed-harness sanitation, exact-copy, deterministic secrets, selected
Product-Security checks, and the preserved user hook in the specified order,
only when their leaf/surface is enabled. Re-enable requires fresh evidence.

Verification:

```sh
node --test tests/advanced-baseline.test.js tests/advanced-sync.test.js tests/advanced-secret.test.js tests/advanced-verdict.test.js
```

### Slice 8 - Honest service runner and real history activation

Use one selected-service-driven runner for source/target CI; reject
missing/malformed/no-op bindings; verify convention state; permit vacuity only
for declared surfaceless predicates. Require a vetted external scanner and real
full-history first-enable result or exact-finding waiver.

Verification:

```sh
node --test tests/advanced-runs.test.js tests/advanced-reports.test.js tests/advanced-secret.test.js
```

### Slice 9 - Host-axis contracts, claim status, and first wires

Implement the §10.1 status model: a declared `status` per `{host, axis}`
cross-checked against its evidence bundle in both directions. Build and emit
adapters for the **whole** roster, not only the advertised subset. For the four
initially advertised axes, author the complete contract and axis-local official
evidence and capture real first wires. Cover legitimate near-matches, and retire
unsupported `pi` MCP from legacy and catalogue paths.

No file may enumerate the advertised hosts. Prove promotion by adding one
first-wire bundle and observing the axis promote with no Gate 1 edit and no list
edit.

Verification:

```sh
node --test tests/advanced-hosts.test.js tests/advanced-enforcement.test.js tests/basic-renderers.test.js
```

### Slice 10 - Safe six-provider CI integration and bootstrap

Author exact provider contracts/evidence, additive existing-config adapters,
collision refusal, explicit absent-CI provider selection and plan approval,
least-privilege/no-secret pipelines, report upload, idempotence, and real
first-run receipts.

Verification:

```sh
node --test tests/advanced-ci-floor.test.js tests/advanced-apply.test.js
```

### Slice 11 - User-global writes, attribution, and claim disclosure

Implement §6.4 append and namespaced additive merge for user-global surfaces,
the clone-local install ID, per-entry attribution from the first install, the
`.rig/global-writes.json` ledger, and the uninstall/reinstall semantics. Add the
§6.5 claim line to install output and every run report, and prove it adds no
prompt or flag to the unverified path.

Verification:

```sh
node --test tests/advanced-global-writes.test.js tests/advanced-claims.test.js
```

### Slice 12 - Distribution

Author the committed root `install.sh`, delete the inherited npm publish
workflow, move `package.json` to `5.0.0`, and prove a stranger with only git,
curl and sh can install into an empty repository from a released tag.

Verification:

```sh
node --test tests/advanced-distribution.test.js
```

### Slice 13 - Author all 115 service packs

Replace every TODO/generic/repeated fragment with service-specific identity,
scope/exclusions, applicability, dependencies, cumulative grades, honest
disposition, checks, and acceptance evidence. Reuse existing Rig skills where
identity matches, without copying filler. Run the independent exact-digest
115-leaf semantic/MECE review.

**Leaves are authored one at a time, in a single context.** Not in parallel, not
family-batched, and not from a template. The failure this project is recovering
from was 432 placeholder files produced at volume; the constraint that prevents
a recurrence is that one context writes each leaf and has seen the ones before
it. This is the longest slice in the plan, and that is accepted rather than
optimised away.

Verification:

```sh
node --test tests/advanced-catalogue.test.js tests/advanced-services.test.js
node scripts/check-advanced-spec.js
```

### Slice 14 - Complete matrix, fresh specification review, and regression

Run every frozen acceptance case over representative repo/host fixtures,
all exact host/CI contracts and first wires, malicious/disabled/re-enabled
policy paths, concurrency/replay cases, UI-less override, dependencies,
remediation rollback, scanner failures, and failing/vacuous/gapped services.
Run the report-only fresh Gate-2 review against the final exact digest; only a
clean receipt may change this document's status to `FROZEN`.

Verification:

```sh
node scripts/check-advanced-spec.js
node --test tests/advanced-*.test.js
npm run test:rig
npm test
```

## 14. Risks and Explicit Limits

- **Semantic sanitation and drift judgment inherit the host model's limits.**
  The static floor, bounded evidence, fail-closed verdict, and human approval
  are Tier 2 defenses. Sandboxing, egress control, DLP, immutable telemetry, and
  an independent semantic runtime remain Tier 3.
- **Git hooks are per clone.** The committed dispatcher is team-shareable, but
  each clone/worktree must run materialization to install its resolved
  pre-commit hook and owns separate one-use approval state. CI is the share-time
  backstop.
- **Tier 2 cannot mediate unexposed or nested OS network behavior.** Verified
  host adapters mechanically cover only their documented shell/web/MCP events.
  An allowed process may perform hidden egress and an unrestricted same-user OS
  adversary may bypass repo files. Sandboxing/egress proxy remains Tier 3;
  status reports each gap.
- **User-presence assurance depends on the host/OS provider.** A repository
  signature verifier can prove a receipt, not biometric/hardware integrity.
  Provider contracts and first wires are therefore release evidence, not
  assumed trust.
- **No Rig timer means unchanged consent may remain pending.** Full context
  binding, visible age, explicit revoke/revoke-all, native expiry, and atomic
  consumption prevent widening/replay; elapsed time alone does not invalidate
  the user's exact choice.
- **Unknown CI formats cannot be safely rewritten generically.** The check
  command may be materialized dormant, but unknown/malformed/colliding config
  remains byte-identical and produces a visible nonzero integration gap.
- **Vetted history scanning introduces a user-managed prerequisite.** Rig does
  not auto-install a scanner or claim that its staged regex floor is a history
  scanner. Missing/unsupported tooling keeps the selected service pending.
- **MECE has a semantic component.** Unique scope keys and spot checks prevent
  mechanical duplication; an independent catalogue review must still compare
  prose boundaries before release.
- **The whole catalogue is an authoring-volume risk.** It does not justify a
  template engine or generated filler. Every fragment must name concrete checks
  and pass the shared service-shape contract.

- **Four verified hosts is a narrow base.** The initially advertised hosts have
  similar permission models, so the enforcement design is shaped by their
  conventions and may fit later hosts poorly. Recorded in Gate 1 §9 as accepted.
- **A user-global write has global blast radius.** Installing in one repository
  changes behavior in every project that host opens. Disclosed in the §6.5
  install line; there is no separate prompt, by ruling.
- **Clone-local identity orphans entries on repository deletion.** Deleting a
  repository without uninstalling leaves its user-global entries with nothing
  that knows their identifier. Status names them; Rig does not reap them.
- **Gate 1 integrity depends on a key the intent owner holds.** If it is lost or
  never obtained, nothing protects Gate 1 from an agent that can write the
  repository, and the fallback is a visible multi-file edit — a deterrent and an
  audit trail, which this document does not call protection. A signature also
  stops forgery but not persuasion: an intent owner who is convinced to sign a
  revision is through the control by design.
- **The authoring model is self-declared.** D8's wrapper proves the *reviewer's*
  model, and the D10 signature proves Gate 1 has not moved, but the
  authoring-context block in this file's header is asserted by the authoring
  context. It is the one unproven link in the review chain.
- **Nothing checks the reviewer's competence.** Human sampling was declined in
  Gate 1 §9. A blind spot shared between authoring and reviewing models passes
  review and reaches users. This is the direct carry-over risk from the run that
  produced 432 `TODO` fragments on this same scope.

None of these limits changes Gate 1. A request to remove the default-on posture
or complete user disablement, weaken truthful/gap reporting, reduce the frozen
115-service commitment or the 19-host/six-CI **build** commitment, advertise an
axis without a first wire, add a fifth selectable level, or introduce a Rig
model/runtime returns to grilling.

## 15. Implementation Handoff

The implementer owns the smallest code that realizes these seams. They may
combine internal modules, but must preserve:

- the staged sanitation state machine;
- leaf-only `rig.json`;
- one exact-byte-activated `.rig/network-policy.json` safety authority;
- independent control/surface switches and fresh evidence generations;
- verified user-presence approval plus clone-local exact one-use consumption;
- one normalized evaluator across verified shell/web/MCP surfaces;
- cumulative grades and named dependency slices;
- explicit honest service dispositions and nonzero missing/no-op bindings;
- vetted real history activation and exact transactional remediation;
- typed no-clobber graft operations;
- atomic apply, policy, approval, and receipt evidence;
- exact per-axis host/CI contracts, additive/approved CI bootstrap, and real
  first-wire gates;
- report behavior and B1 containment;
- all frozen Gate 1 acceptance cases.

Implementation must not edit `business-spec.md` / `acceptance.md` or
`../../archive/grilling/advanced-grilling.md`. Completion requires `npm test` green.

## 16. Candidate Freeze Blockers

Version 0.3 deliberately remains a candidate. It cannot be marked `FROZEN`
until:

1. the exact per-axis contracts and official/first-wire evidence required by
   Section 10 are authored inside this sole authority for every axis this
   product **advertises** as `verified`. Axes shipping as `emitted` do not block
   this, which is the whole point of the D1/D2 split;
2. all 115 leaves replace TODO/generic/repeated content and pass the exact-digest
   fresh catalogue review;
3. the Section 12 specification gate and complete **45-ID** executable oracle
   exist and are red only for missing product behavior, not stale assertions;
4. the intent owner has signed the frozen Gate-1 message with a
   hardware-presence key and the gate verifies that signature (D10). Without it
   the gate cannot pass at all, so this blocker gates every other one;
5. a fresh-context report-only review of the final candidate digest, run under a
   model different from the one named in this file's authoring-context block,
   finds no unresolved or contradictory mechanism.

Green legacy/current code tests cannot remove any blocker.

One thing this list deliberately does not require: that every host work. It
requires that every claim be true. v0.2 conflated those and produced a release
gate no amount of implementation effort could satisfy, because it demanded
first-wire evidence for 19 hosts and six providers whose licences nobody
possessed.
