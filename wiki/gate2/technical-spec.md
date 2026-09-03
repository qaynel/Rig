# Tier 2 Advanced - Working Implementation Design v0.17

> **Status: WORKING. Present, checked, and deliberately not frozen.** This
> version is retraced to the D24/D28 one-gate oracle plus the Path B amendment,
> with the signed Path B base at 83 cases and a 95-case onboarding-hardening
> amendment prepared for the intent owner's signature.
> It supersedes v0.11's lint-format-only D21/D23 release boundary: all 115
> catalogue leaves are release-blocking at declared Policy grade; all 55
> vendored skills are wired by Rig name; onboarding activates only detected
> or explicitly requested host trees; and named-tag `5.0.0` distribution
> carries the upstream MIT notice and provenance without an endorsement
> claim. The static Tier-1 path installs the neutral 55-skill set without a
> runtime, while the hostless tagged-release path additionally installs the
> catalogue and safety runtime; all six CI providers have additive adapters;
> lifecycle and review evidence use one shipping schema. Lint-format retains
> its evidenced Context and Evidence behavior.
>
> There is one freeze: business intent, acceptance, and the deterministic
> testing infrastructure are signed before production implementation. This
> technical specification is checked for presence and remains editable as
> implementation learns, provided the signed oracle remains unchanged.

**Gate 1 pins.** This working design is written against exactly these bytes:

| Gate 1 file | SHA-256 |
|---|---|
| `business-spec.md` | `3b66c7705d293c14c43163945b60f9d190eb55c10d7246257fa7940dd8614375` |
| `acceptance.md` | `34f427696e00c4c0cf6655425314f5f5e96c2d6dc6e3a184487b33f343ae4391` |

The D28 amendment is signed into the oracle for the v5.0.0 release candidate.
If either digest changes, this design is stale and every review receipt bound
to it is void.

**Gate 1 integrity (D10, D17, D19).** Gate 1 is protected by signature, not by
repository process. The oracle gate verifies an SSHSIG signature over the
exact message below, in namespace `rig-gate1`, before it runs any other check:

```text
rig-oracle-freeze-v2
business-spec.md <sha256>
acceptance.md <sha256>
testing-infrastructure.manifest <sha256>
```

Lowercase hex, one trailing newline, paths exactly as written. The signature
must come from a key that no agent on the intent owner's machine can operate
without a live human act (`AT-GATE-2`, D19). The gate verifies the signature and
the listing; the key's class is recorded by the intent owner beside the signer
identity and is not derivable from the artifact. §8.4's weaker policy floor does
not apply here.

Source-repository artifacts, sitting beside Gate 1:

| Path | Role |
|---|---|
| `wiki/gate1/testing-infrastructure.manifest` | Stable, sorted `SHA-256  path` pairs for the oracle verifier, acceptance tests, fixtures/helpers, and package scripts that order the verifier before code tests. The manifest does not list itself; its digest is signed in the message above. |
| `wiki/gate1/gate1.sig` | Detached SSHSIG signature over the message above. |
| `wiki/gate1/gate1.allowed-signers` | Public verification identities for the intent owner. Public key material only, each entry carrying `namespaces="rig-gate1"`, plus a comment line per identity recording the key class the intent owner attests it to be (D19). Its presence arms the check (D17). |

Do not confuse these with `.rig/policy/allowed-signers` in §3.2: that is a
**target-repository** artifact governing policy activation in a user's repo.
Same SSHSIG primitive, different presence floors: `.rig/policy/allowed-signers`
uses §8.4's declared-and-disclosed policy-activation floor, while
`gate1.allowed-signers` uses the stricter D10/D19 Gate 1 floor requiring a
signer no agent can operate without a live human act. Separate trust stores with
separate lifecycles. Neither can authorize the other.

**The signers file is the trust root, and it sits inside what it protects.** A
context that can write the repository can replace `gate1.allowed-signers` with a
key of its own and re-sign; nothing cryptographic prevents that, because the
only thing that could is an anchor outside the repository and GA-11 withdrew
every git-shaped candidate for one. Gate 1 §9 records this residual under D17
and D19. Two mechanisms make the substitution expensive rather than free:

- **The gate names the signer on every run.** On pass it prints the SHA-256
  fingerprint of the key it verified against and the principal it matched. A
  swapped trust root announces itself on every `npm test` to the one person who
  knows their own fingerprint.
- **The entry is namespace-restricted.** Each `gate1.allowed-signers` line
  carries `namespaces="rig-gate1"`, which OpenSSH supports in this file. A
  signature the intent owner produced for another purpose — git commit signing
  uses namespace `git` — cannot be presented here.

Neither closes the hole. They make it a change the intent owner sees rather
than one they have to go looking for, which is the honest ceiling for a control
whose verifier and trust root live on the same disk as the adversary.

This document is the sole current technical approach for implementing the
a-la-carte delivery model. It may be revised without re-signing, but a SOW,
task list, coverage plan, or later ruling cannot supersede the signed oracle.

- Gate 1 rationale: [`../sources/logs/advanced-grilling.md`](../sources/logs/advanced-grilling.md)
- Shipped Basic mechanism being extended:
  [`../sources/superseded/deprecated-tier-taxonomy/basic/basic-design.md`](../sources/superseded/deprecated-tier-taxonomy/basic/basic-design.md)
- Prior production-plan context (subordinate for the re-grilled catalogue):
  [`../specs/product-spec.md`](../specs/product-spec.md)

**Version history.** v0.1 through v0.16 moved to
[the timeline](../index/timeline.md#the-technical-designs-own-version-history-v01v016)
— it is a changelog, not part of the current design. The short version: each
point release retraced this document to a new owner ruling or closed a
specific review finding without changing the signed oracle; nothing in that
history is a live open item. History scanning is limited to vetted
full-history argv and semantic drift consumes indexed input digests and
structured review status.

**Default branch.** It is `prod`. `origin/main` does not exist, and any
workflow naming `main` or `master` is wrong. D10 removed the branch dependency
from Gate 1 integrity, but the branch name still governs CI configuration and
release tagging.

## 1. Gate 1 Restatement

Rig defaults to making the target's agent harness safe before offering the
complete Development, Testing, Infrastructure, and Product-Security catalogue
as `family -> group -> service -> grade`. The repo scan recommends; the user
can override every recommendation. Missing dependencies auto-pull only their
exact required slices. Every install grafts onto existing agent infrastructure.

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
**verified enforcement surface** exists — Gate 1 `AT-BASE-2`'s term for a
surface at which the vendor actually exposes a mechanical enforcement hook Rig
can drive. An unsupported surface retains the installed agent rule and produces
an explicit enforcement gap, never a mechanical-block claim.

"Verified enforcement surface" here is a property of a host's capability, not a
label Rig prints. It is a **third** sense of the word, distinct from the two the
rest of this document is careful about: it is neither the withdrawn
host/axis *tier* badge that §11.1 and AD-26 ban from install output, run
reports, and per-host registry projections, nor the control/tool evidence status
of §8.9 where `verified` means a leaf holds fresh current-epoch evidence. In
§11.1's emission vocabulary a verified enforcement surface is simply an axis the
vendor exposes and Rig `emit`s a contract for; where the vendor exposes nothing
the axis is `unsupported` and the evaluator returns a `gap`. The word never
reaches a user-facing surface as a per-host claim, so `AT-CLAIM-1`'s grep for it
there still finds nothing. §11.1 records this three-way split once, at the point
the tier was withdrawn.

**Rig builds every host adapter through one path and activates detected hosts
(D24).** The source carries the complete 19-host and six-provider roster. During
onboarding, mechanical marker discovery selects exactly the host trees already
present; an absent tree is not created unless the user explicitly requests that
host. A bare repository therefore receives no implicit host tree. Across the
fixture matrix every host remains reachable through the same code path, with no
second-class surface. Emitting nothing is permitted for an absent/unselected
tree or an evidence-backed unsupported axis, and the exact reason is reported.
Rig draws no verified-versus-unverified tier in output or data and proves every
emitted axis with byte-landing tests.

**The D24 release is broad and shallow.** Every one of the 115 leaves ships at
Policy (`minimal`) with its grade and untailored-baseline status stated on the
fragment's face. All 55 vendored skills are materialized and discoverable by
their Rig names. Lint-format alone retains higher-grade Context/Evidence claims.
Missing bindings remain named coverage gaps; D24 creates no generic success
binding or silent skip.

**Activation requires a present human, or it does not happen (D6).** Policy
activation uses a verified host-native presence prompt where one exists,
otherwise a user-configured external signature. Where neither is available,
activation is refused and reported unavailable. It is never silently skipped,
degraded to an ordinary confirmation, or treated as successful. Rig specifies
the signer interface and verifies signatures; it ships no signing binary and
stores no key material.

**Lost policy-signer recovery is pre-registered and terminal (D20).** A lost or
compromised policy-activation signer can be replaced only by a recovery
credential that was registered while the old trust state still had a valid
credential. Recovery credentials are distinct SSHSIG security-key (`sk-*`)
identities of a **declared** class, verified under their own namespace, and
their private material stays outside the repository, Rig state, and unattended
agent reach. As with the everyday policy signer (D19), Rig verifies the
signature and the listing but cannot prove from the artifact that a hardware
authenticator was involved; it records the declared `sk-*` class and discloses
it, and the user attests that the key meets the live-human-act floor. What makes
this hold rather than the label is the registration ceremony (§8.4): each
recovery key is generated through a user-verification authenticator act, so an
agent cannot register a key it could later operate unattended. Rig offers three
recovery credentials at first signer setup and offers to add more on later
signer setup while a valid credential remains. If the everyday signer and
every registered recovery credential are gone, recovery is permanently refused
for that policy trust state. Invalidating pending edits, burning one-use
approvals, and resetting evidence epochs happen only after an authorized
recovery receipt is written; an agent request cannot trigger them by itself.

Agents may draft policy revisions only when the user asks for that exact draft
or when a user-approved delegated policy-edit mode is active. Delegation is
proposal authority, not activation consent: every active permission change
still requires fresh approval of the exact revision. Installed base prompts
state this as a hard rule and forbid inferring policy consent from prior
approvals, chat context, task urgency, tool access, or the delegation itself.
Delegation is scoped to the session it was given in and is never written to
disk, so a later session cannot produce anything that proves it held the grant
(D12). The prohibition on self-activation is a Rig product rule, not a policy
clause (D13, `AT-BASE-7`).

**Writes outside the repository are permitted, attributed, and never
destructive (D9).** Where a vendor ships only a user-global surface, Rig
appends or performs a namespaced additive merge, never an overwrite, and
discloses the global blast radius at install time by naming the file written
outside the repository. Every entry Rig writes to a shared user-global file
carries the identity of the repository that wrote it from the first
installation onward, so uninstalling one repository leaves every other
repository's configuration intact and reinstalling replaces rather than
accumulates.

**Removal is part of the product (D11, D14).** Every write Rig makes to a file
it does not exclusively own is delimited by managed-block markers and recorded
in an install manifest as it happens, so uninstall removes exactly Rig's own
content and leaves every user-owned byte untouched. Rig also keeps a
pre-modification copy of each touched file, used to prove the result is clean
and never to restore over the user's later work. An interrupted install
resumes from the manifest; while incomplete, no partially applied control is
reported as enabled or protecting anything.

**Findings stay on the machine that produced them (D15).** Reports are
excluded from version control, are not committed, and are not uploaded as
build artifacts. In CI the job emits a pass/fail verdict with counts and rule
identities and does not print finding detail to the log. **Matched secret
content does not reach the model by default (D16).** Credential detection is
deterministic; matched content enters an agent's context only when the user
has explicitly enabled model-assisted triage.

**A product that cannot be installed is not shipped (D7).** Distribution is
inside this design: a committed install stub, the retirement of the inherited
npm publish workflow, and a first production release.

Rig remains B1 config:

- no model key;
- no daemon or independent agent runtime;
- no persistent semantic memory store;
- the host agent performs semantic judgment and repo-specific transition work;
- committed repo documents are the durable context.

The implementation is complete only when all frozen archetype, baseline,
property, and bespoke acceptance cases are executable and green.

## 2. Final Mechanism Decisions

These are implementation constraints, not suggestions:

| ID | Working mechanism |
|---|---|
| AD-1 | Extend the shipped `rig/materialize.js` entrypoint and `rig/lib/*`; preserve the legacy Basic CLI. |
| AD-2 | Keep catalogue choices in committed, leaf-only `rig.json`. Keep all safety choices in the separate user-owned `.rig/network-policy.json`; catalogue edits never authorize safety changes. |
| AD-3 | Keep source-owned service metadata in `rig/catalog.json` and service fragments under `rig/catalog/`. |
| AD-4 | Compose grades cumulatively as identity + minimal + mid + maximal fragments with strictly growing check-ID sets. |
| AD-5 | Resolve dependencies as named slices; never replace or silently raise a user-selected grade. |
| AD-6 | Default to `inspect -> host review -> recommend -> plan -> apply -> check`. An exactly activated policy may disable sanitation; the flow then records sanitation disabled/not run and continues without a clean/protected claim. |
| AD-7 | Treat target harness files as hostile bytes: bounded reads, no execution, redacted evidence, fail-closed uncertainty. |
| AD-8 | Keep remediation separate and read-only until approval. Exact proposal approval, unchanged preimages, transactional writes, observed-diff equality, no-op rejection, rollback, and a fresh sanitation run are required before success. Remediation mutations use §7.6's journal with `transaction_kind: remediation`; a successful user-content change is retained but excluded from uninstall, while every rolled-back write is superseded by a `rolled_back` record carrying the restored digest so install resume/removal cannot mistake it for live installation state. |
| AD-9 | Graft through typed create/replace-owned/ensure-line/structured-merge/hook operations; never arbitrary shell plans. |
| AD-10 | Apply under an exclusive target lock with compare-and-swap preimages, baseline-first phases, the §7.6 append-only install manifest recording every write before it happens, and activation receipt last. A failed apply never rolls back: writes already recorded `applied` stay in place, the receipt (the final write) is absent, and re-running resumes from the manifest per `AT-INSTALL-1`. |
| AD-11 | Materialize service prose once under `.rig/services/`; host surfaces get thin pointers only. |
| AD-12 | Ship every default control's dormant implementation, but wire and execute only the independent controls and enforcement surfaces enabled by the active policy. Installed code is not evidence that a control ran. |
| AD-13 | **One uniform adapter path; automatic activation only for detected hosts.** The registry carries bounded marker paths for all 19 hosts. Auto onboarding selects exactly the unambiguous markers present; shared generic files never select a host alone, and absent hosts receive no tree unless explicitly requested. Every emitted axis carries the same contract shape and byte-landing proof. `unsupported` axes emit nothing and cite the vendor absence. No verified/unverified tier exists in output or data. |
| AD-14 | Emit the complete catalogue menu; recommendations remain advisory and user selections win. |
| AD-15 | Attempt every service as `executable` first; that is the default disposition, not one of three peers. Executable services require real repo-adapted argv bindings with `shell: false`. `convention` is a fallback that must carry a service-specific named reason why execution is not meaningful for that service in particular; a generic or repeated reason scores as a coverage gap. `surfaceless` must name the exact reason nothing can run. Missing, malformed, silent, no-op, or unreasoned bindings are nonzero coverage gaps. |
| AD-16 | Write failed, vacuous, coverage-gap, disabled/unrun, activation-pending, and evidence-stale state where Gate 1 requires visibility. Routine current-epoch passes remain omitted from failure reports. |
| AD-17 | Reuse Basic's MCP resolver/renderers only for evidence-backed supported paths through the Infrastructure compatibility slice. Unsupported MCP, including `pi`, is retired from every legacy and catalogue emission path without deleting user-owned files. |
| AD-18 | Drive implementation from a complete signed executable transcription of Gate 1. The oracle verifier runs before code correctness; `npm test` remains the full code gate. |
| AD-19 | Validate candidate policy bytes strictly, hash the exact bytes with SHA-256, and keep the last activated bytes as a separate immutable snapshot. Unapproved edits are inert. Agents may write policy candidates only under an explicit current user request, of which session-scoped delegated edit mode is one form; delegation authorizes proposal authoring only, never activation, and is **never persisted** (D12), so a fresh session's claim to hold it is unverifiable by construction and refused. |
| AD-20 | Prefer a verified host-native user-presence approval that attests the exact digest. Otherwise require an external SSHSIG signature verified through `ssh-keygen -Y verify` against a namespaced challenge. Where neither is available, **refuse activation and report it unavailable** — there is no third path. Both available methods produce one common, replay-resistant activation receipt. Rig never invokes a signing binary and never stores key material. |
| AD-21 | Store one-use approvals clone-locally and uncommitted. Bind them to the complete normalized action and active policy, consume atomically before dispatch, and keep them valid only until used, changed, revoked, or expired by the native host; Rig adds no clock timeout. |
| AD-22 | Evaluate one normalized action policy across shell, built-in web, and network-capable MCP adapters. Narrow permanent allowances are the default authoring path; explicit category-wide allowance and global enforcement disablement remain available. |
| AD-23 | Integrate verified existing CI additively. With no CI, require explicit provider selection and exact plan approval before creating a minimal native pipeline. Unknown/malformed CI is preserved and fails visibly; verification requires a real first run. |
| AD-24 | **Treat every axis in the 19-host/six-provider roster and every one of the 115 leaves as an MVP release commitment.** Each selected emitted axis has a complete §11 contract and byte-landing proof; every leaf clears §5.6 at declared Policy grade. D24 retires D23's lint-format-only exception. An unsupported vendor axis emits nothing with evidence; an absent/unselected host emits nothing with detection provenance. |
| AD-25 | Write user-global host configuration by append or namespaced additive merge only, never overwrite. Attribute every written entry to a repository identity from the **first** installation, using a generated ID stored clone-locally under `git rev-parse --git-path rig/`, with remote URL and repository realpath carried as entry metadata so removal reports name something a human recognises. The ID is never committed. Uninstall removes only the current repository's entries; reinstall replaces them in place. |
| AD-26 | **Disclose the out-of-repository blast radius at install time, per `AT-HOME-1`.** The install line names any configuration written outside the repository. There is no per-host claim string in install output or run reports — no `verified` or `emitted` label, no "please report" invitation, no framing that draws a tier. The honest observation that Rig has not seen enforcement fire on any host is a statement about the product, its home is the host registry header, and a user who wants it reads it there. *(Amended v0.6:* "verified enforcement surface" — Gate 1 `AT-BASE-2`'s term for a host that exposes a mechanical hook — is a distinct third sense of `verified`, expressed internally as `emitted`/`gap`/`unsupported` and kept out of the banned user-facing per-host claim surfaces; §1 and §11.1 record the three-way split.)* |
| AD-27 | Ship a committed root install stub that fetches a released version tag from GitHub by name, defaulting to the latest release with an override for a specific one. Do not embed a build fingerprint. Download to a file and execute it; never pipe the network into a shell, because Rig's own default policy denies exactly that. The root tagged-release path invokes the static bootstrap with its explicit active-delivery gate so catalogue and safety runtime bytes land without changing local Tier 1's runtime-free contract. Delete the inherited npm publish workflow and move `package.json` to `5.0.0`, still `private`. |
| AD-28 | Verify the complete oracle by signature, not repository process: recompute both Gate 1 digests and `testing-infrastructure.manifest`, verify the v2 namespaced SSHSIG message, then verify every sorted path/digest entry before product tests. Verify the signature, not the key class; the owner attests that separately. Run this verifier first in `npm test`, short-circuiting code tests, and provide `npm run test:code`. An unarmed checkout reports `Gate 1 unprotected` and continues; once `gate1.allowed-signers` exists, every missing/malformed/stale signature fails closed. |
| AD-29 | Produce every review receipt through a wrapper that starts a fresh reviewer session, invokes it non-interactively, and itself writes the digest it computed over the reviewed bytes and the timestamp. The reviewing agent supplies findings only and never authors those binding fields. |
| AD-30 | Recover a lost or compromised policy-activation signer only through a pre-registered recovery identity in `.rig/policy/recovery.allowed-signers`, verified as an SSHSIG security-key signature under namespace `rig-policy-recovery`. Registration requires an already-valid credential, records a registration receipt in `.rig/policy/trust.json`, and rejects a recovery key whose fingerprint matches an everyday signer. First signer setup offers three recovery identities; later signer setup offers to add more while any valid credential remains. Exhausting the everyday signer and every registered recovery identity is terminal for that policy trust state. Recovery side effects are applied only after a valid recovery receipt is committed. *(Amended v0.6/v0.11:* the `sk-*` class is **declared and disclosed**, not certified from the signature (D19); the registration user-verification ceremony — not the label — is what stops an agent holding a valid credential from registering a key it could later operate unattended, and a platform that cannot request user verification refuses registration with `user_verification_unavailable`.)* |
| AD-31 | **Author the D24 MVP broadly at Policy grade.** All 115 leaves are authored in one pass and all are release-blocking. Each fragment declares Policy and untailored baseline status; missing bindings remain coverage gaps. Sequential one-leaf authorship is suspended for this release and returns for post-beta Context/Evidence promotion. Lint-format alone retains its existing higher-grade vertical evidence. |
| AD-32 | **Map Policy → Context → Evidence onto the cumulative `minimal/mid/maximal` dial** (§5.7). `minimal = Policy`, `mid = Context`, `maximal = Evidence`; the ladder inherits AD-4 cumulative composition and AT-SHAPE-3 grade-invariant identity unchanged. Commodity syntax/format/type/static output are inputs, not grades. The selected grade is the target and the ceiling: evaluate cheapest-deterministic-first; a lower-grade *failure* may short-circuit, but a clean lower-grade result continues through to the selected grade (Context runs every Policy check plus its understanding pass; Evidence runs every Context check plus its local verifiable-evidence work). Never exceed the grade, and never report assurance above the highest grade actually completed. Policy is the ceiling only when Policy itself is selected. §11.3's additive CI graft is the Evidence grade's repository enforcement surface, proposed and approved separately; CI absence cannot make the per-run Evidence verdict logically unreachable. The disposition is `executable` (AD-15). Universal method, but authored and proven only for lint-format now (GA-23). |
| AD-33 | **Lint-format's unit of work is a repository component** (§5.8): whole-repository, open-ecosystem discovery derived from the repository (no fixed roster), semantic command binding by role with ambiguity returned to the user, hybrid-plus preservation of existing toolchains by default, user-approved partial-coverage exclusion of uncoverable components, and a per-component evidence-backed support claim whose whole-repository form is the AND over discovered non-excluded components. |
| AD-34 | **Lint-format execution is plan-bound and read-only by construction** (§9.4). Selection authorizes nothing; only an exact-digest-approved plan authorizes its listed read-only commands, directories, and components, disclosed as untrusted code with `shell: false` not presented as safety. Diff-scoped by default in the component's working directory honoring its ignore rules; a read-only check that mutates the tree is detected, halted, evidenced, and never auto-restored; autofix is a separately approved mutating action re-verified by re-running the check; command drift halts before running; every abnormal ending is its own distinct non-passing state. |
| AD-35 | A policy proposal that changes `secrets.model_assisted_triage` from false or absent to true carries the full third-party disclosure and its digest. Activation requires a verified host-native or external-signature approval bound to the exact proposal and explicitly confirming that disclosure digest. Status repeats the disclosure while triage is enabled. |
| AD-36 | A release review receipt binds the exact implementation worktree as well as the technical specification and catalogue. The worktree digest covers every tracked or publishable untracked file with path, type, mode, and bytes; review receipt files are excluded to avoid self-reference. The fresh report-only reviewer examines the PR diff plus untracked implementation files, and validation rejects a stale or mismatched implementation digest or base. |
| AD-38 | The root installer and local bootstrap accept an explicit `--openclaw-mcp` flag. Without it they do not invoke OpenClaw or require npm. With it they print the global-path/blast-radius disclosure, preflight `openclaw`, `node`, and `npm`, copy `rig-mcp/` into the target runtime, run `npm ci --omit=dev --ignore-scripts` against its committed lockfile, and then call `openclaw mcp set rig-<install-id> <stdio-json>`. The install ID and server name are recorded in `.rig/global-writes.json`; no code parses or writes OpenClaw JSON5. Reinstall uses the recorded name. Uninstall calls `openclaw mcp unset` before removing the runtime; if that cannot complete, it reports best effort and retains the runtime. |
| AD-39 | The non-interactive check runner reads elevated execution authority only from a committed, target-owned `.rig/execution-policy.json`, never from environment or a prompt. It is a separate authority from generated `.rig/service-bindings.json`: bindings request `network: "required"`, `timeout_ms`, or `memory_limit_mb`; policy grants are keyed by the exact service ID and set the maximum permitted raised timeout/memory and network grant. Missing, malformed, uncommitted, or insufficient authority refuses that command. `network: "none"` needs no elevated grant and is isolated; an undeclared network state remains a visibly reported compatibility state. The initial schema is `{ "schema_version": 1, "grants": { "service.id": { "network": "required", "timeout_ms": 1200000, "memory_limit_mb": 4096 } } }`; unknown keys and invalid values fail closed. |

### 2.1 Rejected approaches

- A verified/unverified host tier in Rig's output or data. Withdrawn by the
  2026-08-17 amendment: it drew a distinction the product never implemented,
  invited "please report" friction on the unverified path, and pushed authoring
  effort toward advertising decisions instead of shipping. What replaces it is a
  single uniform emission path proved by a byte-landing test per axis.
- A per-host claim line in install output or run reports, in any wording. Same
  ruling: user-facing output does not draw the tier. The one thing that
  survives is the out-of-repository write disclosure, and its home is
  `AT-HOME-1`, not a "claim" section.
- A hard-coded list of advertised hosts, or a promotion event that flips an
  axis from `emitted` to `verified`. Neither exists in this design: every
  emitted axis is a release commitment on the same footing, so promotion is
  not a concept.
- A confirmation prompt, extra flag, or acknowledgement gating any host path.
  Every emitted host has the same non-interactive install surface as every
  other.
- A second installer, target daemon, Rig model key, or mutable memory
  database: duplicates the shipped spine or violates B1.
- YAML, a template engine, or a new validation dependency: unnecessary for the
  strict JSON and cumulative-fragment contract.
- Persisted group selections or grade-specific service IDs: obscures the
  frozen per-service grade choice.
- Whole-group dependency pulls or dependency-grade escalation: violates exact
  razor-scoped auto-pull.
- A combined scan/profile/install command or automatic remediation: makes
  sanitation ordering and user consent unprovable.
- Blind copies, malformed-config fallback, arbitrary shell operations, or
  user-file deletion: violate graft/no-clobber safety.
- Duplicated full service prose per host: creates footprint and drift.
- Installing test/security/infra engines during onboarding: exceeds the frozen
  convention-and-binding delivery model.
- A non-disableable baseline, a single coarse baseline switch, or hidden
  enforcement after disablement: contradicts complete user control and
  truthful status.
- Safety toggles in `rig.json` or split safety/network authorities: couple
  catalogue selection to authorization or create policy-precedence ambiguity.
- Canonicalized or section-level policy approvals: make normalization or
  mixed-revision precedence part of the authorization boundary. Exact
  validated bytes are simpler and stronger.
- A committed approval marker, an unattended signing key, or TTY confirmation
  alone: an agent with repository/shell access could self-authorize.
- Repository-shared one-use approvals or category/target-only action
  identity: allow replay or authorize materially changed actions.
- A Rig-imposed session or minute timer: expires unchanged user intent while
  adding clock/session machinery. Context changes, explicit revocation, native
  expiry, and atomic consumption are the meaningful invalidators.
- A bundled naive history grep presented as the leak-scanner service: creates
  a misleading security ceiling.
- Generic success bindings, silent binding skips, note-only scans, no-op
  remediation, marker-only live hooks, or advisory-only CI verification:
  fabricate completion without observable behavior.
- Branch protection, code ownership, or an upstream-branch comparison as the
  Gate 1 integrity mechanism: withdrawn by GA-11.
- An unsigned digest pinned in this file as the sole Gate 1 protection: it
  forces a visible multi-file edit, which the product does not describe as
  protection.
- A build fingerprint embedded in the install stub: the stub and the source
  come from the same repository.
- `curl | sh` installation: Rig's own default policy denies
  `remote_content_execution`.
- Lazy or retrofitted user-global attribution added on the second install: an
  unattributed first entry can never be safely removed.
- A prune subsystem for orphaned user-global entries: `AT-HOME-2` does not ask
  for it.
- A `trust.json` bootstrap, reset, or start-fresh command that can replace the
  policy signer without a pre-registered recovery signature: this makes the
  reset command the real root of trust.
- An infinite recovery chain where a weaker fallback recovers the recovery
  mechanism: the system is only as strong as that weakest fallback.
- Reusing the everyday policy signer as its own recovery credential: circular
  recovery does not survive the loss it claims to handle.
- Parallel or template-driven catalogue authoring: the failure this project is
  recovering from was 432 placeholder files produced at volume. Leaves are
  authored one at a time.
- Transactional rollback on a failed apply, as a second teardown path
  alongside §7.6 removal. This was already rejected once at the business-spec
  level (GA-12) and briefly reappeared in this file's own §6.6/§10 as an
  unreconciled leftover; the round-3 review (`AT-INSTALL-1`) caught the
  contradiction. The manifest-and-resume model in §7.6 is the only failure
  behavior an apply has.

## 3. Current-State Trace

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
| `rig/manifest.json` | Canonical release payload: Tier 1 instructions, neutral/host skills, plumbing, catalogue, and safety runtime | Keep fixed release content here; user service selection remains in `rig.json`. |
| `rig/lib/payload.js` | Typed, contained, journaled copies/tree copies/pointer appends with host detection | Use for the fixed release payload and named-tag install; selected-service grafts remain in `apply.js`. |
| `rig/lib/renderers.js` | Legacy MCP shapes still include unsupported `pi` output | Reuse only evidence-backed shapes, fail closed on malformed config, and retire unsupported MCP across legacy/catalogue paths. |
| `rig/lib/guard.js` | Real staged-secret floor and chained pre-commit shim | Retain as the deterministic secret control; make invocation policy/surface-aware and add the other enabled dispatcher controls. |
| `rig/lib/receipt.js` | Tracks Basic-owned MCP output | Reference during adoption; add a separate catalogue receipt. |
| `rig/lib/plan.js` / `apply.js` | Typed plan, verified approval, lock, CAS, record-before-mutate journal, receipt last | Keep selected-service grafts on this transaction spine; pending records reconcile before new work. |
| `rig/lib/checks.js` / generated `check.js` | Selected bindings run without a shell; missing generic Policy bindings are explicit nonzero coverage gaps | Keep source and installed outcomes aligned as further leaves earn repository adapters. |
| `rig/lib/host-capabilities.js` | 19 entries, aggregate citations, and marker-only live hooks | Split by shell/web/MCP/approval axis; every axis emits through the same code path and each is proven by its own byte-landing test. |
| `rig/lib/ci-adapters.js` | Six provider render/apply paths, separate approval, additive preservation, journaled writes, and idempotent first-wire matrix | Retain provider-native bounded insertion and fail closed when a shape cannot be classified safely. |
| `docs/agent-portability.md` | Actual host instruction/plugin surface | Starting evidence for the capability registry. |
| `scripts/check-rule-copies.js` | Source-repo exact-copy guard | Pattern for target-local `.rig/sync-map.json` checking. |

The 2026-08-23 production findings are closed in code and regression tests.
One pre-existing product-design gap remains: first-enable secret-history
scanning has no user-visible disclosure surface at the point of enabling. That
cannot be inferred from implementation because the intent owner must choose the
product interaction before it is built. A fresh independent review receipt and
the release tag are release operations after that decision, not implementation
substitutes for it.

Important constraints:

- `runPayload()` can overwrite same-path files and is unsuitable for the new
  no-clobber path.
- `mergeJson()` currently treats malformed JSON as empty. The new path must
  fail closed instead of replacing malformed user content.
- The Basic receipt does not own copied Tier 1 payloads and cannot by itself
  prove those paths safe to replace.
- The current guard's installation is coupled to MCP in the legacy path. The
  catalogue path must materialize dormant default control machinery
  independently of service selection, then wire only active policy surfaces.

## 4. Architecture

### 4.1 Source-owned files

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

### 4.2 Target-owned and Rig-owned files

After a catalogue install:

```
rig.json                              # user-owned committed selection
.rig/
  network-policy.json                 # user-owned candidate safety policy
  network-rules.md                    # Rig-owned explanatory guide
  catalog-receipt.json                # Rig-owned install evidence
  install-manifest.jsonl              # Rig-owned append-only journal (§7.6)
  catalog-routing.md                  # Rig-owned selected-service router
  install-docs.md                     # Rig-owned per-host install runbook
  context-index.json                  # Rig-owned central context map
  sync-map.json                       # Rig-owned exact-copy groups
  service-bindings.json               # Rig-owned argv bindings
  service-activation.json             # Rig-owned activation/evidence epochs
  global-writes.json                  # Rig-owned ledger of out-of-repo writes
  policy/
    trust.json                        # public signed trust-state and recovery receipts
    active.json                       # exact active bytes + activation receipt
    allowed-signers                   # public verification identities
    recovery.allowed-signers          # public pre-registered recovery identities
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
    <run-id>.json                     # failed/vacuous/coverage-gap runs only
```

Host files contain one pointer or a thin native-skill wrapper, not duplicated
service prose. CI receives an additive job/file only where its adapter can be
verified; every repo still receives `.rig/bin/check.js`.

Clone-local one-use approvals live below the path returned by
`git rev-parse --git-path rig`, never an assumed `.git` directory, and are
never committed, copied into install receipts, or uploaded as CI artifacts.
Private signer material lives outside the target repository in the
user-controlled host/OS approval facility. Recovery credential material also
lives outside the repository and Rig state, and must require a live human act
before it can sign. The committed public trust record lets clean CI checkouts
verify the active bundle and registered recovery identities, but changing or
deleting it cannot bootstrap a new signer.

The same clone-local directory holds the §7.6 preimage store — the bytes of
each touched path as it stood immediately before Rig first modified it. It is
uncommitted, both because a preimage of a user-owned configuration file can
contain that user's credentials and because a linked worktree must not share
state with another.

The same clone-local directory holds `install-id`, a generated identifier
created at first install and used to attribute every entry Rig writes to a
user-global file (§7.4). It is deliberately **not** committed: a committed
identifier would be shared by everyone who clones the repository, and one
developer's uninstall would then strip entries from a teammate's personal
configuration file.

The cost of clone-local identity is that deleting a repository without
uninstalling orphans its global entries permanently. Rig does not build a
reaper for this. `policy status` lists any Rig-written global entry whose
recorded repository path no longer contains an install, and the user removes
it. Disclosure rather than a subsystem.

### 4.3 Runtime shape

There is no resident process. Node is used in three bounded situations:

- source-side onboarding/materialization;
- git/CI deterministic checks;
- explicit service-run wrappers.

The semantic reviewer and transition installer are host-agent skills. They
produce or consume typed JSON artifacts; they do not call a Rig model.

## 5. Catalogue Contract

### 5.1 Canonical IDs

IDs are lowercase dot-separated ASCII:

```
<family>.<group>.<service>
```

Renames require aliases in source metadata but the target manifest always
normalizes to the canonical ID. An ID may own exactly one service. Families
and groups are catalogued but are not persisted as selections.

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

### 5.2 Catalogue entry

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
- `convention`: service-specific installed behavior plus an executable
  verifier of that installed state, without a fabricated command;
- `surfaceless`: a deterministic applicability predicate and specific reason
  why execution is impossible; only this disposition may complete vacuously.

An executable binding may reuse an existing repo command, native tool, or
already installed dependency. It may not be `true`, `echo`, an empty command,
`process.exit(0)`, or any equivalent generic-success stub. A selected
executable service with no applicable valid binding is `coverage_gap` and
nonzero, never silently skipped.

### 5.3 Grade composition

```
minimal = minimal checks
mid     = minimal + mid checks
maximal = minimal + mid + maximal checks
```

The materialized service file follows the same concatenation. A grade fragment
cannot redefine identity, family, group, owned scope, dependencies, or report
behavior.

### 5.4 Dependencies

Resolution input is the user's leaf map. Resolution output preserves:

- `selected_grade`, if any;
- `required_slices`, sorted;
- `required_by`, sorted;
- `install_reason`: `selected`, `dependency`, or both.

Algorithm:

1. Validate every selected ID and grade.
2. Seed the effective map with explicit selections.
3. Walk each service's named dependency edges in canonical ID order.
4. For an explicit grade, walk requirements attached to all included
   cumulative grade fragments.
5. For a dependency-only slice, walk only that slice's requirements.
6. Add only the referenced slice to the dependency entry.
7. Repeat to a fixed point.
8. Reject a cycle with its full path.
9. Topologically sort effective entries, then use ID as the stable tie-break.

The ladder is metadata, not a second resolver. Each rung maps to a small,
audited floor-slice bundle. Selecting a higher-rung service expands the exact
earlier bundles. It never expands an entire group.

### 5.5 Existing and vendored Rig skill reuse

When a service matches an existing Rig skill, its identity fragment references
that skill as the implementation source. Catalogue overlays add grade/slice
behavior without forking the base skill.

The 55 vendored skills under `rig/catalog/skills/` join the same registry.
Materialization enumerates their manifest metadata, validates unique Rig names,
copies each complete skill directory plus `LICENSE.upstream` and `UPSTREAM.md`,
and exposes only those names through each detected host's supported skill
surface. Host discovery and skill discovery use the same selected-host set;
no absent host tree is created to carry skills. A missing directory, duplicate
name, invalid skill frontmatter, or omitted notice is a hard coverage gap.

### 5.6 Authored-service gate

All 115 leaves are release-blocking under D24. A complete leaf contains
service-specific identity, owned scope, adjacent exclusions, applicability,
explicit dependencies or `none`, cumulative grade behavior, disposition,
checks, and acceptance evidence. Every D24-authored fragment declares itself
Policy-grade generic baseline practice and explicitly says it is not tailored
to the installing repository. Lint-format alone may retain Context and
Evidence claims backed by its existing vertical evidence.

The deterministic gate rejects `TODO`, `TBD`, known generic filler such as
`Concrete convention`, repeated normalized fragment bodies, generic check IDs,
missing evidence targets, missing grade declarations, or wording that presents
untailored Policy content as repository coverage. It evaluates all 115 leaves
(26 Development, 40 Testing, 31 Infrastructure, 18 Product-Security); D23's
lint-format-only exception is retired.

Mechanical checks are necessary but not sufficient. A fresh-context catalogue
review covers every leaf and adjacent MECE boundary, records one semantic
verdict per service, and binds its receipt to the exact catalogue plus fragment
digest. A changed byte invalidates the review. Before implementation the
all-leaf executable target is expected to fail on current placeholders; after
authoring, that same signed target must pass without changed oracle bytes.
### 5.7 The Policy → Context → Evidence grade ladder (D21, GA-22/23)

Lint-format's three grades **are** Policy → Context → Evidence — the
domain-specific names of the cumulative `minimal → mid → maximal` dial, not a
second axis. `minimal = Policy`, `mid = Context`, `maximal = Evidence`. This
mapping is deliberate and load-bearing: it lets the ladder inherit AD-4's
strictly-growing check-ID composition and AT-SHAPE-3's grade-invariant identity
and strict-superset property unchanged, so `AT-LF-8` (Context ⊇ Policy) and
`AT-LF-9` (Evidence ⊇ Context) are satisfied by the same §5.3 machinery every
service already uses. A grade never changes which service it is; it changes only
how much assurance is built on top.

What each level owns, within lint-format's MECE domain:

- **Level 1 — Policy (`minimal`): govern the change.** Does the change comply
  with the component's declared lint/format policy? The component's own
  deterministic signals — its formatter, linter, type, and static checks, run
  read-only through §9.4 — are the **commodity inputs**, not the grade itself
  (GA-22/23). The Policy verdict is whether the changed files conform. A real
  Policy-level result on the changed files is required; a placeholder, or a
  check that silently ran a higher level, fails `AT-LF-7`.
- **Level 2 — Context (`mid`): understand the change.** Every Policy check plus
  an understanding pass — the host agent reads the diff against the component's
  rules so a finding is reported with its meaning, not just a rule id. Strict
  superset; a Context grade that drops or merely swaps a Policy check fails
  `AT-LF-8`.
- **Level 3 — Evidence (`maximal`): prove the change.** Every Context check plus
  a verdict resting on **verifiable evidence** rather than an agent opinion —
  re-runnable command output, exit codes, and captured tool reports bound to
  input digests. §11.3 separately governs the Evidence grade's repository-CI
  enforcement surface. An Evidence pass backed only by an unverifiable agent
  assertion fails `AT-LF-9`; CI being absent, unknown, or awaiting separate
  approval is reported as its own enforcement state and does not relabel a
  completed local Evidence run as Context.

**"Lowest level capable of a definitive answer" (GA-22) short-circuits on
failure, never on a clean pass.** The selected grade is both the target and the
ceiling: evaluation climbs to it, and no further. Evaluating
cheapest-deterministic-first, a *failure* at a lower cumulative grade may
short-circuit — a definitive Policy fail from the commodity signals is the
answer and nothing higher runs, because a change that fails governance cannot
earn a higher assurance. A *clean* lower-grade result does **not** stop there:
it continues through the user's selected grade. At Context, every Policy check
still runs and the understanding pass runs on top of it, even when Policy passed
cleanly; at Evidence, every Context check still runs and the local verifiable-
evidence work runs on top of it. The separately approved §11.3 CI graft runs
whenever that enforcement surface exists and is active. The reported assurance is the
highest grade actually completed and can never exceed it — so a clean Policy
pass under a Context or Evidence selection is never the final verdict while the
selected grade's own work remains unrun. When Policy itself is the selected
grade, Policy is the ceiling and a clean Policy pass is the complete result.
Three failures this catches: reporting a Policy result as Evidence (over-claim),
silently running above the selected grade (over-run), and stopping short of the
selected grade on a clean lower-grade pass (under-run) — the cases
`AT-LF-7`/`AT-LF-8`/`AT-LF-9` exist to prove do not happen.

The disposition is `executable` (AD-15): the commodity signals are real
repo-adapted processes run under §9.4, attempted first, never a fabricated
command. The leaf's catalogue entry (§5.2 `checks.{minimal,mid,maximal}`,
`disposition`) is re-authored to this ladder as part of leaf authoring; the
current `convention`-marked, formatter/linter/CI-split entry is the superseded
pre-freeze probe the roadmap already flags, and it must meet this contract, not
define it.

**Universal method, vertical proof (GA-23).** Policy → Context → Evidence is
Rig's per-service grade method for the whole catalogue, applied only within each
service's owned domain — but only lint-format is specified and proven now. §14
Slice 14 authors the other leaves' ladders one at a time; nothing in this
section authorizes authoring or implementing them.

### 5.8 Lint-format vertical: whole-repository discovery, components, and the support claim

Lint-format's unit of work is a **component** — a subtree with its own
lint/format ecosystem, working directory, ignore rules, and commands.

**Whole-repository, open-ecosystem discovery (`AT-LF-1`, GA-19/20).**
`inspect`/`recommend` (§6.2/§6.4) discover components across the entire
repository — root, workspaces, nested packages, polyglot subtrees — by reading
the repository's own manifests and layout, never a fixed language or
package-manager roster. Each discovered component carries the ecosystem Rig
derived for it, and every discovered component appears in the reviewable plan
(§6.5), where the user may deselect components before apply (`AT-LF-4`, with
`AT-P5`). A plan that enumerates only the root, or matches against a hard-coded
language list, fails `AT-LF-1`.

**Semantic command binding (`AT-LF-3`, GA-21).** For each component, binding
reads manifests, tool configuration, and declared tasks and binds lint/format
commands **by role, not by fixed script name**, preserving the component's
declared workflow. Ambiguity is never guessed: an ambiguous match becomes a
`needs_user_choice` binding state surfaced in the plan, and apply blocks that
component until the user chooses. Bindings feed §9.1's `shell: false` argv
schema. Reliance on fixed script names, or a silent guess, fails `AT-LF-3`.

**Hybrid-plus (`AT-LF-2`, GA-16/17).** Where a component already has a
configured toolchain, recommendation preserves it by default — the existing
config is byte-identical after `recommend`. Rig may **offer** supported setup
where none exists, or surface a better supported alternative where one does, but
each is an opt-in line in the plan the user must select; nothing changes until
they do. This is §7.3's hybrid posture applied to lint-format, and it never
silently replaces a working tool. A silent replacement or forced migration fails
`AT-LF-2`.

**Partial coverage (`AT-LF-6`, GA-24).** A component for which Rig cannot build
even the Policy level is **uncoverable**. The plan marks it, and apply excludes
it only with the user's explicit approval, records the exclusion in the §7.6
manifest, and reports the component as a visible unprotected gap. Covered
components install through the normal §6.6/§7.6 apply path with every write
journaled at the time it is made (`AT-SHAPE-1`, `AT-INSTALL-1`). An exclusion
applied without approval, or an unrecorded write, fails `AT-LF-6`.

**Per-component support claim (`AT-LF-19`, GA-35/24).** Support is asserted per
component and earned only where Rig built ≥ Policy for that component, bound its
commands, and produced a real (non-placeholder) check result under plan-bound
consent (§9.4). Install success alone is never support — the §5.6 authored-gate
rule at component granularity. The whole-repository claim is the AND over every
discovered, non-excluded component; any approved exclusion suppresses the
whole-repository claim while covered components stay individually supported.
Status projects support per component and withholds the aggregate under any
exclusion. Claiming whole-repository support from install success, or from
per-run results without a built level, fails `AT-LF-19`.

## 6. Staged Onboarding Data Flow

### 6.1 CLI seams

Legacy remains:

```sh
node rig/materialize.js --target <repo> --manifest <basic-config.json>
```

New seams:

```sh
node rig/materialize.js inspect \
  --target <repo> --hosts <auto|comma-separated-host-ids> --out <inspection.json>

node rig/materialize.js host-review \
  --target <repo> --inspection <inspection.json> --out <review.json>

node rig/materialize.js recommend \
  --target <repo> --review <review.json> --out <recommendation.json>

node rig/materialize.js select \
  --menu <recommendation.json> --service <service-id>=<grade> [--service ...] \
  --out <repo>/rig.json

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

node rig/materialize.js policy propose \
  --target <repo> --policy <network-policy.json> \
  --out <policy-proposal.json>

node rig/materialize.js policy activate \
  --target <repo> --proposal <policy-proposal.json> \
  --approval <policy-approval.json>

node rig/materialize.js approvals list \
  --target <repo>

node rig/materialize.js approvals revoke \
  --target <repo> --action-digest <sha256>
```

Source checkouts use the `node rig/materialize.js` form above. Active-runtime
installs journal an executable `.rig/bin/rig` shim that accepts the same
subcommands and delegates to the installed runtime; bootstrap changes into the
target and prints the staged command sequence. The default markdown-only
bootstrap installs neither the shim nor runtime.

The CLI remains argument parsing and orchestration. Domain logic stays under
`rig/lib/`. Approval files contain a verified host-native attestation or
external user-presence signature; a bare digest flag is never approval. There
is no on-disk delegated policy-edit receipt to present either: per §8.3
delegation lives in the session and nothing records it.

**Pre-v5 onboarding execution contract.** `host-review` is the only conversion
from an inspection to the verdict-bearing review consumed by
recommend/plan/apply: it carries the original harness digest and computes the
adoption verdict from the inspection findings. `select` is the only conversion
from a recommendation menu to `rig.json`; it accepts explicit user-selected
`service=grade` pairs, rejects services absent from the menu and unsupported
grades, and executes no repository code. Bootstrap prints those producers in
order with `--hosts auto`, not a literal host placeholder. After plan it may
pause for real consent, but it never manufactures an approval receipt or a
manual MCP server entry. The staged path reuses the same selected-server receipt
as legacy credential output when one exists; otherwise it emits only honest
no-server-selected guidance.

`--hosts auto` is the default. It checks only the registry's bounded
repo-relative marker paths and returns the exact detected set in canonical host
order. Shared generic files such as `AGENTS.md` do not identify a specific host
on their own. An explicit host list is the only path that may opt an absent host
in; the reviewed plan records `detected` versus `explicit` provenance for each
selected host. The same selected set controls instruction, skill, hook, and MCP
planning so one phase cannot create a tree another phase did not select.

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

### 6.2 Inspect

`inspect` is read-only with respect to the target. It:

1. validates the auto-detected or explicit host set and records each host's
   provenance plus the marker paths that selected it;
2. canonicalizes the target and refuses paths outside it;
3. discovers only agent-harness/config surfaces;
4. rejects out-of-root symlinks and records unreadable/oversized files;
5. computes SHA-256 for every input;
6. runs the audited deterministic detector set;
7. emits redacted findings and bounded context;
8. emits an aggregate `harness_digest` and canonical `selected_hosts` list.

It does not profile application code and does not emit the catalogue menu.

### 6.3 Host semantic review

The bundled sanitation-review skill consumes the inspection artifact. It emits:

```json
{
  "schema_version": 1,
  "harness_digest": "<sha256>",
  "host": "codex",
  "verdict": "ALLOW_WITH_RESTRICTIONS",
  "findings": [],
  "restrictions": [],
  "unverifiable": [],
  "reviewer": { "kind": "host-agent", "host": "codex" }
}
```

Verdicts are exactly `ALLOW`, `ALLOW_WITH_RESTRICTIONS`, `QUARANTINE`, or
`BLOCK`. Unambiguous blocker rules force `BLOCK`; uncertainty or unverifiable
inputs force `QUARANTINE`. The validator recomputes the harness digest before
every later phase. Restrictions must be known typed IDs with plan behavior;
unknown/free-form restrictions are unverifiable and force `QUARANTINE`.

### 6.4 Recommend

An allowed, current review unlocks `recommend` when sanitation is enabled. An
exactly activated sanitation disablement also unlocks it, but the output
carries the disabled control state and no sanitation verdict. Profiling uses
bounded, non-executing signals:

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
grouped by family. The default selection is all four families, but the user
explicitly confirms or trims that family set before choices are written to
`rig.json`; the manifest stores confirmed leaf selections, never an implicit
family wildcard.

### 6.5 Plan

`plan`:

1. validates `rig.json`, source ref, catalogue digest, and candidate/active
   policy state;
2. revalidates sanitation review freshness when enabled, or records the
   approved disablement;
3. resolves dependency slices and ladder order;
4. resolves every selected service disposition and binding/verification plan;
5. resolves host emission for the selected detected/explicit hosts through the
   roster's one uniform path (§11.1); absent hosts receive no tree, while an
   `unsupported` selected axis emits nothing and cites the absence;
6. detects CI and, when absent, requires an explicit verified provider choice;
7. adapts service conventions to detected repo facts;
8. inventories every target collision and before hash;
9. emits exact typed graft, policy-wiring, and CI operations;
10. emits a content-bound plan digest and human-readable summary.

Plan creation writes nothing to the target.

### 6.6 Apply

`apply` verifies exact user approval of the plan digest and rechecks the
manifest, applicable review/disablement, active policy, plan, target
preimages, and source catalogue. It acquires `.rig/catalog-install.lock` with
exclusive creation, stages files under the target filesystem, and commits
operations in phase then lexical path order: policy/default control machinery,
enabled control/surface wiring, services, pointers/adapters, CI, final
receipts. Service runners require the complete final receipt, so no selected
service can operate against partial policy or binding state.

Every one of those writes goes through the §7.6 install manifest: a `pending`
record lands before the write, an `applied` record carrying the post-write
digest supersedes it after. If any operation fails, apply does **not** roll
back — that would be a second teardown path alongside §7.6 removal, already
rejected once (GA-12) and again by the round-3 review (`AT-INSTALL-1`). Writes
already recorded `applied` stay exactly where they landed. Because
`.rig/catalog-receipt.json` is the last write in the sequence, no receipt
exists and nothing downstream reports the install as active, enabled, or
protecting anything. Re-running apply resumes from the manifest per §7.6: each
`applied` path is skipped once its on-disk digest matches, each not-yet-landed
write proceeds, and nothing is duplicated or restarted.

The lock records PID and start time for diagnostics but is never
auto-broken. The user removes a stale lock explicitly after verifying no
apply is active.

## 7. Graft Mechanics

### 7.1 Ownership classes

Every path is one of:

- **absent**: `create_owned` is allowed;
- **Rig-owned and receipt-clean**: `replace_owned` is allowed;
- **byte-identical shipped legacy payload**: adopt, then treat as Rig-owned;
- **user-owned**: pointer append or namespaced structured merge only;
- **conflicting/unknown**: block and explain.

Install and upgrade never delete a user path. Uninstall removes only
receipt-owned files and managed entries, and restores chained hooks.

### 7.2 Instruction graft

The central entry is `.rig/catalog-routing.md`. Host adapters use the smallest
supported surface:

| Host surface | Graft |
|---|---|
| Repo-local native skills | Thin skill wrapper that points to one central selected service. |
| Always-on project rules | Stable pointers to `.rig/catalog-routing.md`, authoritative `.rig/network-policy.json`, and explanatory `.rig/network-rules.md`. |
| Live shell/web/MCP hook | Additive native adapter that normalizes the documented vendor event, invokes the common policy evaluator, and returns the documented allow/deny/proceed response. |
| No live enforcement hook | Project policy instruction plus each enabled deterministic git/CI surface; status names the missing mechanical surface as a gap. |

Existing `AGENTS.md`, `CLAUDE.md`, and equivalent files are never replaced.
The pointer is appended once. Where an existing framework already has a
router, the pointer is added to that router instead of creating a competing
framework.

A host adapter is not a pointer or marker. §11.1 specifies the exact contract
every emitted axis must carry — path, event schema, matcher, deny payload,
merge boundary, preservation, first/repeated apply — and its byte-landing
test asserts the correct bytes land in the correct paths on a fresh target.

### 7.3 Repo transition

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
part of catalogue onboarding.

The Product-Security leak-scanner service is stricter: first enablement must
discover a configured vetted scanner such as Gitleaks, TruffleHog, or an
explicit equivalent and invoke its documented full-history mode. Rig does not
install a scanner and does not substitute its staged-secret regex floor for
the history scan.

### 7.4 User-global writes and repository attribution

Some vendors ship no repository-scoped configuration surface. For those, the
choice is to write the user's global file or leave that host unserved; `AT-
CLAIM-1` forbids leaving it unserved. Rig therefore writes outside the
repository under strict rules.

Every such write is an append or a namespaced additive merge. Rig never
overwrites a user-global file, never rewrites it wholesale, and never deletes
a value it did not write. Every pre-existing user value survives
byte-for-byte.

Every entry carries the writing repository's identity from the first
installation onward:

| Surface format | Attribution mechanism |
|---|---|
| JSON | Entries nested under a Rig-owned namespace keyed by install ID. |
| TOML | The same, expressed as a namespaced table per install ID. |
| Line-oriented or markdown | Sentinel fences carrying the install ID, wrapping only Rig's own lines. |

The exact user-global MCP writer contracts verified on 2026-08-24 are:

| Host surface | File | Format / vendor container | Rig ownership key |
|---|---|---|---|
| Windsurf / Devin Desktop legacy Cascade | `~/.codeium/windsurf/mcp_config.json` | JSON `mcpServers` | `rig-<install-id>-<server-name>` |
| Cline IDE shared settings | `~/.cline/data/settings/cline_mcp_settings.json` | JSON `mcpServers` | `rig-<install-id>-<server-name>` |
| Hermes | `~/.hermes/config.yaml` | YAML `mcp_servers` | `rig-<install-id>-<server-name>` inside install-ID sentinel comments |
| CodeWhale | `~/.codewhale/mcp.json` | JSON `servers` | `rig-<install-id>-<server-name>` |

`rig/lib/global-writes.js` owns these contracts and their merge/remove
implementation. JSON merges preserve all unrelated keys and server values;
Hermes accepts only the block-mapping form it can update without guessing and
fails unchanged on unsupported YAML shapes. Reapply replaces the same
attributed entry, and removal first verifies the current value and exact
current-home contract path. The CodeWhale `~/.deepseek/mcp.json` location is a
legacy fallback, not the primary contract. Cline CLI's separate
`~/.cline/mcp.json` surface is not conflated with the Cline IDE contract above.

These writers do not by themselves activate a host. The signed Basic path
continues to emit advisory notes for these four hosts until the host roster and
first-wire gate in RIG-110 authorizes activation; that preserves the existing
consent and release boundary while making the write lifecycle executable and
testable.

Attribution is required on the first install, when no second repository
exists yet: an unattributed entry can never afterwards be safely removed.
Attributing lazily on the second install would owe the user a migration
`AT-HOME-2` rules out.

Operations:

- **Install.** Append or namespaced-merge this repository's entries. Record
  each written path, surface, format, and entry key in
  `.rig/global-writes.json`.
- **Reinstall.** Replace this repository's entries in place. Idempotent, never
  duplicated or accumulating.
- **Uninstall.** Remove only this repository's entries. Every other
  repository's entries and every unattributed pre-existing user value survive
  byte-for-byte. The removal report names the repository whose entries were
  removed, using the recorded realpath and remote, and does not claim to have
  removed entries belonging to another repository.

**OpenClaw exception (D25).** OpenClaw's active configuration is JSON5 at
`~/.openclaw/openclaw.json`, so Rig must not reuse the JSON writer above. The
root installer and bootstrap accept `--openclaw-mcp`; the flag is the sole
explicit consent and the default never prompts for or writes this host. Before
the write, output names that path and its all-workspaces effect. The installer
requires `openclaw`, `node`, and `npm`; copies `rig-mcp/` to
`.rig/runtime/rig-mcp`; installs its committed lockfile with
`npm ci --omit=dev --ignore-scripts`; and then invokes `openclaw mcp set` with
the stdio server definition. The server key is `rig-<install-id>`, where the
stable, clone-local ID and exact key are recorded in `.rig/global-writes.json`.
The native CLI owns JSON5 parsing, validation, and atomic writes. Failed
preflight or dependency installation occurs before that command and leaves the
global configuration untouched.

During uninstall, read the recorded OpenClaw entry and invoke `openclaw mcp
unset <server-name>` before deleting `.rig/runtime/rig-mcp`. A missing or
failing CLI makes this one removal best-effort, names the global file and
server, and retains that runtime and its ledger record for a safe retry. It
must not hand-edit JSON5 or leave a configuration entry pointing at deleted
code.

A user-global write changes behavior in every project that host opens. That
blast radius is disclosed in the install line by naming the file written
outside the repository (`AT-HOME-1`). OpenClaw is the D25 exception: its
explicit installer flag is the sole host-specific selection; the default stays
non-interactive. Neither path emits a per-host claim string.

### 7.5 Install-line output

Install output states one thing about hosts, plainly: which configuration
files were written, including any file written outside the repository. It
does not label any host or axis as `verified`, `emitted`, "please report", or
any other term drawn from the withdrawn tier. The honest observation that
Rig has not observed enforcement fire on any host is a product-level
statement whose home is the host registry header; a user who wants that
context reads it there.

The install line is deterministic and non-interactive. Every host is treated
the same way except the D25 OpenClaw flag: selecting it authorizes the global
write and causes the required warning before the native CLI runs. It is not an
interactive acknowledgement or a host-quality claim. The default path never
requires OpenClaw or npm and never creates its global configuration.

### 7.6 Install manifest, resume, and removal

**One rule.** A mutation is recorded **at the time it is made**, not
reconstructed afterwards. Removal that has to infer what install did will
eventually infer wrong.

**The manifest.** `.rig/install-manifest.jsonl` is an append-only journal,
one JSON object per line, covering every mutation Rig makes — inside the
repository or user-global. Append-only and line-delimited so a crash
mid-write truncates only the final line, which parses as damaged and is
discarded. A malformed **non-final** line is not treated as crash damage:
uninstall and resume refuse before deleting or reconciling anything, and
name the bad record. Each record carries a monotonic `seq`, the absolute `path`, the
`ownership` class from §7.1, the `operation` (`create_owned`,
`replace_owned`, `append_managed`, `merge_namespaced`,
`global_merge_namespaced`, `global_append`, `remediate_user_content`), the
managed-block marker identity
where one applies, the `install_id` from §4.2, a `transaction_kind` (`install`
or `remediation`), and a `state`. Install entries use `pending`/`applied`;
remediation entries use `pending`, `committed_user_change`, or `rolled_back`.
For user-global surfaces, a JSON or TOML namespaced additive merge records
`global_merge_namespaced` and a line-oriented or markdown fenced append records
`global_append` (§7.4), so a record names its write shape rather than hiding
it behind one code.

**Records are written before the mutation, not after.** A record lands as
`state: "pending"`; the mutation is then applied; a second record with the
same `seq` and `state: "applied"` supersedes it and carries the post-write
digest. Last write per `seq` wins. A record written after its mutation would
mean a crash in between leaves an applied write nothing knows about, and that
write is unremovable without guessing. A record written before means a crash
leaves a `pending` entry for a mutation that may never have happened, and
every removal step is written to be idempotent — delete-if-present,
unmarker-if-present — so a `pending` entry costs a wasted check and nothing
else.

**Preimages.** Immediately before Rig first modifies a path it stores that
path's bytes content-addressed under the clone-local Rig directory returned
by `git rev-parse --git-path rig`, alongside `install-id`, and names the
digest in the manifest record. Only the first modification is stored. They
live clone-local and uncommitted for §4.2's reasons plus one of their own: a
preimage of a user-owned configuration file can contain that user's
credentials.

**Incomplete installs never claim to protect.** The manifest header carries
`complete: false` from the first record until the install's final record
lands. While it is false, `policy status`, the install line, and every run
report state that the install is incomplete and report no control as enabled,
installed, or protecting anything.

**Resume, not restart.** Re-running a transition-install with an incomplete
manifest resumes from it. Each `applied` record is verified against its
recorded digest and skipped; each `pending` record is re-checked against the
file and applied only if it did not land. Applied work is never duplicated.
A `pending` record whose file state cannot be classified blocks with the
path named, under the `conflicting/unknown` class of §7.1.

Remediation entries do not participate in install resume. A
`committed_user_change` records that the owner-approved content edit succeeded
and remains user-owned; a `rolled_back` entry carries the restored digest and
records that no live mutation remains. A remediation entry left `pending` by a
crash is reconciled against its preimage and expected output before any new
install or remediation action proceeds: exact output may be rolled back, exact
preimage is recorded `rolled_back`, and any third state blocks by path.

**Removal walks the manifest in reverse.** Install writes a target before any
reference to it; uninstall walks descending `seq` so a reference is always
removed before its target. The public uninstall command (`--uninstall` and
the `uninstall` subcommand) uses this journal as the only removal authority;
receipt-based cleanup is a compatibility shim for Basic MCP artifacts that
predate the journal, not a second set of semantics. Every recorded path passes
symlink-aware containment before namespace or preservation decisions, and
classification uses that contained relative path rather than the journal's
lexical spelling; uninstall does not write through in-repo symlinks. The
journal identifies removal candidates but, because it is repository-editable,
does not independently prove exclusive ownership of a provider-generic CI
file or of an arbitrary line inside one. Only a dedicated Rig-named CI
artifact is whole-file removable. The only CI managed-line removal is the
exact pointer the GitHub adapter appends, and only for that append-managed
write; a forged `managed_line`, `managed_block`, or `append_managed` record
cannot strip other CI bytes. Common provider pipeline paths remain named
best-effort even if a record calls them `create_owned` and its digest matches.
Other files Rig exclusively owns are
deleted. Files Rig only added to have their managed line or block
removed and nothing else; if that strip leaves a file Rig created empty, the
file is deleted, and empty Rig-created parent directories are removed.
Chained hooks are restored per §7.1, including when the hooks directory
lives outside a linked worktree. User-global entries are removed by
`install_id` per §7.4. The journal itself is kept while any local removal is
best-effort, so a later retry still has a record; both ordinary uninstall
and `--purge` delete the journal only after a clean local removal. Uninstall
then reports exactly what it removed. There is no second teardown path for a
partial install.

Entries whose `transaction_kind` is `remediation` are never uninstall targets:
`committed_user_change` is a user-approved working-tree edit and `rolled_back`
has no live mutation to remove.

**Verified clean, or named best-effort.** After removal, each touched path is
diffed against its preimage. A path differing only by the user's own later
edits is reported **verified clean**; a path whose managed block cannot be
located, because the markers were edited away or another tool rewrote the
file, is reported **best-effort** with that specific file named, and is never
called clean. Preimages are evidence for this diff only; uninstall never
writes one back over the current file. Both words are per-path removal-report
vocabulary about one file's observed end state, scoped to uninstall output.
They are not the host/axis claim vocabulary §11.1 withdrew — that withdrawal
removed the `advisory` tier outright — and they are outside the surfaces
`AT-CLAIM-1` asserts against.

**Usage artifacts are not installation state.** Removal touches only what the
manifest records. Accumulated run reports under `reports/rig/`, run history,
and post-install configuration the user filled in themselves — `rig.json`
and `.rig/network-policy.json`, both user-owned in §4.2 — are not manifest
entries and survive. `uninstall --purge` removes them too, and prints the
complete list of what it will delete before deleting anything.

### 7.7 Per-host install documentation

Gate 1 (GA-1) scopes "per-host install documentation" into Tier 2 Advanced:
"proper documentation for proper installation for each host," the named
analog of Basic's `.rig/mcp-setup.md` runbook (PD8). PD8's standard carries
over unchanged: the manual step must be *easy*, not merely documented.

`.rig/install-docs.md` is a single Rig-owned file, fully regenerated on every
`apply` so it never drifts from the current install. It carries one labeled,
copy-pasteable section per host in the roster:

- for a host with at least one `emitted` axis (§11.1), the section names
  exactly what was written — the axis, the path, and the format — and, where
  an axis needs a manual completion step (a config-path export, an `.env`
  load line, or an equivalent one-time action), gives the literal command
  rather than a description of one, exactly as PD8's per-host wiring blocks
  did for MCP;
- for a host whose every axis is `unsupported`, the section cites the vendor
  absence instead of an empty stub.

The file is generated content, not user-editable install state: it is
Rig-owned in `.rig/`, deleted on uninstall per §7.1, and carries no claim
label (`verified`, `advertised`) per §7.5 and AD-26 — it documents what was
written, not a tier of confidence in it.

## 8. Default-On, User-Controlled Safety Baseline

### 8.1 Independent controls and enforcement surfaces

The policy stores explicit boolean leaves. Initial leaves are:

| Kind | Stable ID | Behavior when enabled |
|---|---|---|
| Control | `sanitation.harness` | Static harness inspection, current semantic review, changed-harness re-scan, and fail-closed verdict handling at applicable triggers. |
| Control | `drift.exact_copy` | Byte-exact duplicate checking from `.rig/sync-map.json`. |
| Control | `drift.semantic` | Host-agent review of stale/deprecated/contradictory context. |
| Control | `secrets.deterministic` | High-precision secret and tracked-`.env` checks over the applicable diff/repo scope. |
| Control | `network.action_policy` | Default-deny protected-action evaluation and permanent/one-use allowance handling. |
| Surface | `host.shell` | Mechanical enforcement at the shell-tool boundary where the vendor exposes one. |
| Surface | `host.web` | Mechanical enforcement at the built-in web-tool boundary where the vendor exposes one. |
| Surface | `host.mcp` | Mechanical enforcement at the network-capable MCP boundary where the vendor exposes one. |
| Surface | `git.pre_commit` | Local pre-commit dispatcher enforcement. |
| Surface | `ci.repo` | Whole-repo CI enforcement and verdict emission (counts and rule identities only; no artifact upload, `AT-REPORT-1`). |

Group names such as `sanitation`, `drift`, `host`, `all_controls`,
`all_enforcement`, and `all_baseline` are authoring conveniences. The editor
expands them into writes against the persisted section switches and leaves
defined in §8.2 before the candidate policy is written; they are never stored
as keys and add no precedence layer of their own. Validation rejects a policy
document that contains one as a key.

Control code may be materialized while dormant so a later approved policy can
enable it without fetching machinery. A disabled control is not invoked. A
disabled surface is not wired, or its previously receipt-owned adapter is
transactionally unwired while user-owned configuration remains intact.
Materialization alone never yields a protection claim.

### 8.2 Authoritative policy schema

`.rig/network-policy.json` is the sole user-owned safety authority. Shape:

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
  },
  "secrets": {
    "model_assisted_triage": false
  }
}
```

`secrets.model_assisted_triage` is the one field in this schema that **loosens**
rather than protects, so it sits outside the control/enforcement AND model below
and outside the leaf-status machinery: it is default-closed, only the user can
open it, and opening it is an ordinary exact-byte policy activation whose
enabling point states the third-party reason (§8.8, `AT-SECRET-1`). Its sole
effect is to widen what §8.8's detection pipeline may hand the agent; it changes
no other permission and is disclosed by `policy status` whenever it is true.

There are exactly **two** persisted levels for the protective controls:

1. **Section switches** — `enabled`, `controls.enabled`, `enforcement.enabled`,
   and `network.enabled`. Real precedence.
2. **Leaves** — the individual control and surface booleans.

Effective state is the logical AND of the top-level `enabled`, the applicable
section switch, and the leaf. A false section switch preserves its child
values so re-enabling restores the user's prior choices, but every affected
pair enters a fresh evidence generation.

**Status reports at leaf granularity, always.** When a leaf is inactive
because its section switch is false, status names that leaf as disabled *and*
names the section switch as the reason.

The four protected categories apply consistently after host events are
normalized. A permanent allowance names one category. The normal authoring
path also binds the surface, tool/method, operation, destination, and other
applicable match fields. The user may deliberately choose `scope: "category"`
to allow that whole category, set `enforcement.enabled` false to disable all
blocking, or set top-level `enabled` false to disable the complete Rig safety
policy.

If an action matches multiple protected categories, every enabled category
must be allowed. A broad allow for one category cannot bypass another.

`.rig/network-rules.md` explains categories, examples, status, and recovery.
Every installed agent pointer identifies the JSON policy as authoritative;
conflicting prose has no effect.

**Self-activation is not expressible in this schema (D13, `AT-BASE-7`).**
There is no key that grants an agent authority to activate its own proposals,
and validation rejects any document that invents one — an unknown key is
already a hard rejection under §8.3's activation step 1. The prohibition is a
Rig product rule compiled into the activation path itself: activation
requires a verified user-presence approval of the exact digest, and no branch
reads policy to decide whether that requirement applies.

This rule is **not** held as an invariant clause in a second file or a
separate repository. An agent with repository and shell access reaches a
second file exactly as easily as the first, so a split would add ceremony and
no protection — the same reasoning that withdrew D5. What makes the rule hold
is that it is not data anywhere: it is the absence of a schema key plus an
activation path with no policy-driven branch around its approval check.

### 8.3 Candidate, active snapshot, and exact revision identity

The user edits `.rig/network-policy.json` as a candidate. An agent may write
a candidate only when the user requested that exact proposal in the current
interaction. Delegated policy-edit mode is one form that request takes — a
standing grant for the rest of the session — and it authorizes proposal
authoring only, never activation.

**Delegation is session-scoped and Rig persists no record of it (D12).** No
repository-bound delegated policy-edit receipt is written anywhere. An agent
in a fresh session asserting it holds delegated edit mode is refused; the
refusal needs no lookup because the claim is unverifiable by construction.
Revocation is ending the session.

Activation:

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
remains active and status reports `pending_activation`. Any formatting or
byte change requires a new approval. The committed bundle and public signed
`.rig/policy/trust.json` let CI verify the same revision without a private
key.

Before the first user revision, the immutable shipped policy above is the
safe active default. It enables every leaf and denies every protected
category. The candidate materialized for the user begins byte-identical to
that default.

Every installed base prompt and host pointer carries the same boundary in
mandatory language: delegated edit mode, prior approvals, chat phrasing,
tool access, urgency, or broad instructions such as "fix the policy" are
not consent to activate a policy.

### 8.4 User-presence approval, signer setup, and recovery

Two approval methods produce the same receipt:

1. **Verified host-native approval, preferred.** The exact per-host contract
   must prove that the host presents the digest to the user, records
   affirmative user presence, binds repository identity and activation
   sequence, and emits a non-replayable attestation that Rig can verify.
2. **External user-presence signature, fallback.** A signer outside the
   target repository signs the versioned activation message. Rig specifies
   the interface as SSHSIG and verifies it with `ssh-keygen -Y verify`
   against `.rig/policy/allowed-signers` under a domain-separating namespace.
   Rig never invokes a signing binary and never stores private material.

**When neither is available, activation is refused and reported unavailable.**
Terminal state, not degraded success. The prior active bundle stays in force
and the candidate remains `pending_activation` with reason
`no_presence_facility`. The shipped default policy is already active,
enables every control leaf, and denies every protected category, so the user
retains the full catalogue and complete baseline. What they cannot do is
loosen anything.

**The presence floor, and what Rig can actually check (D19).** No SSHSIG
signature carries proof that an authenticator was involved. Verification
establishes two things: the signature is sound, and the key is listed.

So the floor is **declared, verified where it can be, and disclosed always**:

- Rig verifies the signature and the listing. That is what stops the silent
  signer, because the agent's obstacle is that it cannot sign as the user at
  all.
- Rig reads the entry's key-type string and records it as the signer's
  **declared** class. A `sk-` type is evidence of intent, not proof of
  hardware; whoever writes the file chooses the string.
- Every `policy status` output names the declared class for the life of the
  install.

Gate 1 integrity keeps a stricter rule of its own (D10, D19). Its signing key
must be one no agent on the intent owner's machine can operate without a live
human act — a secure-element key behind a per-signature biometric, or a
detached authenticator, but never a readable on-disk key or one parked in a
long-lived agent. Rig cannot verify that property either; per `AT-GATE-2` the
intent owner attests it in the signer identity file and the gate verifies the
signature.

An ordinary CLI confirmation, retyped digest, environment flag, committed
`approved=true`, unattended key available to the agent, or unverified host
prompt is not approval.

The versioned, domain-separated activation challenge binds repository
identity, exact policy digest, next monotonic sequence, previous receipt
digest, a fresh nonce, and any native expiry. After user presence and before
commit, activation re-reads and revalidates the candidate, acquires an
exclusive lock, and compare-and-swaps the previous sequence/receipt.

Policy signer setup writes only public verification material into the
repository. The ordinary signer list is `.rig/policy/allowed-signers`;
pre-registered recovery identities live separately in
`.rig/policy/recovery.allowed-signers`. Both files use SSHSIG allowed-signers
format with namespace restrictions:

- `rig-policy-activation` for ordinary policy activation and one-use
  approvals;
- `rig-policy-recovery` for recovery credentials.

First signer setup establishes the ordinary policy signer through the same
user-presence approval flow as activation. Later signer setup rotates the
ordinary signer only after a valid ordinary activation signature or a valid
recovery signature authorizes the new public signer set. Once an ordinary
credential is valid, first signer setup offers to create **three** recovery
identities. On every later signer setup while a valid credential still exists,
Rig offers to add more. The generation flow is:

1. the user chooses an output path outside the target repository, outside the
   clone-local Rig directory, and outside any path Rig will copy into reports
   or CI artifacts;
2. Rig invokes the platform OpenSSH `ssh-keygen` security-key flow for a
   `sk-*` key with user verification required. If the platform cannot request
   user verification, registration refuses with
   `user_verification_unavailable`; it never falls back to a weaker key;
3. the user performs the authenticator touch/PIN/biometric act for each key;
4. Rig records only the public key, its fingerprint, the declared class, and a
   registration receipt signed by the currently valid ordinary or recovery
   credential.

The recovery identity must be cryptographically distinct from every ordinary
policy signer: matching public-key fingerprints are rejected. A recovery entry
is valid only if its registration receipt is already part of the current
`.rig/policy/trust.json` chain before the ordinary signer is reported lost or
compromised. A fresh key generated after that point cannot be accepted as a
recovery credential for the old trust state.

**Registration cannot be turned into self-appointment (D19, `AT-PRESENCE-2`).**
The dangerous case is an agent that *does* hold a valid credential — mid-session,
after a legitimate approval — and tries to register a key it controls as a
recovery credential, so it can later "recover" unattended. Two properties defeat
it without Rig verifying hardware it cannot verify. First, registration runs the
same generation ceremony as any recovery key: the authenticator user-verification
act in step 3 is required to produce the key, so the credential an agent can
register is, by the same act, one it cannot operate silently later. Second, the
class Rig records is *declared*, and `policy status` discloses it, so a recovery
credential registered under a weaker declared class is visible to the user rather
than passing as hardware-backed. Rig verifies the registration receipt chain and
the fingerprint distinctness; it does not, and per D19 cannot, certify the key's
class from the signature. The residual — an owner who registers a weak recovery
key while recording a strong class — is the same declared-class risk §9 already
records for the policy signer, applied to this domain, not a new hole.

Recovery verifies a versioned challenge containing repository identity, current
trust-state digest, the lost/compromised signer fingerprint, the replacement
ordinary signer set digest, a monotonic recovery sequence, previous recovery
receipt digest, and a fresh nonce. Rig verifies the SSHSIG signature against the
pre-registered recovery identity under `rig-policy-recovery`; it never invokes a
signing binary and never stores recovery private material.

After that verification, and only after the recovery receipt has been fsynced
and atomically committed, Rig applies recovery consequences:

- pending candidate policy bytes are preserved but marked stale, so they cannot
  be activated without a fresh exact-byte approval under the new trust state;
- clone-local one-use approvals from the prior trust epoch are deleted;
- evidence generations for enabled controls are incremented, making prior
  current-epoch evidence stale;
- `policy status` discloses the recovery sequence, replacement signer
  fingerprint, recovery credential fingerprint, and the recovery consequences.

If the ordinary policy signer and every pre-registered recovery identity are
unavailable, recovery is refused permanently for that policy trust state with
reason `recovery_credentials_exhausted`. There is no `--force`, no reset command
that claims continuity with the old trust state, and no fallback to an ordinary
confirmation prompt. A user may still start an unrelated new repository trust
state by deleting Rig's policy artifacts by hand, but Rig must report that as a
new untrusted initialization, not recovery of the old state.

### 8.5 One-use approvals

A denied action may be approved once without changing the permanent policy.
The normalized envelope binds:

- active policy digest and repository identity;
- host and surface (`shell`, `web`, or `mcp`);
- matched category and rule;
- tool/server, method/operation, and destination;
- canonical repository-relative working directory;
- normalized argv or request-body digest;
- relevant file/input preimage digests;
- a remote version, ETag, or equivalent precondition when the host exposes
  one.

Adapters discard only documented non-semantic vendor fields such as event
IDs or timestamps. They retain the raw event digest as evidence. A changed
bound field creates a different action digest and requires new approval.

The same host-native-first/external-signature fallback approves a
domain-separated `approve-once` challenge. The approved envelope is stored
clone-locally under the resolved Git-path `rig/approvals/`. Rig imposes no
clock timeout: an approval remains pending until the action is used, a
bound field changes, the user revokes it, the active policy changes, or a
verified native host expiry occurs.

Before tool dispatch, the adapter acquires an exclusive consume operation
and moves the matching approval out of the pending set. Concurrent attempts
allow at most one dispatch. Consumption is final even if the tool later fails.

### 8.6 Common action evaluator

Every emitted adapter converts its vendor event to the envelope above and
calls one dependency-free pure evaluator. Outcomes:

- `allow_permanent`: a current narrow or explicit category-wide rule matches;
- `allow_once`: one exact pending approval was atomically consumed;
- `deny`: default/rule denial, including category, matched rule, and exact
  deliberate-proceed path;
- `disabled`: the control or surface is disabled and the action is not
  blocked;
- `gap`: the vendor exposes no mechanical enforcement surface for this event,
  so the installed agent rule remains authoritative but Rig does not claim
  enforcement.

Shell adapters normalize command/argv, cwd, intended environment access, and
network destination. Web adapters normalize method, URL/destination, headers
relevant to policy, body hash, and any handoff from remote content to
execution. MCP adapters normalize server, tool, transport/destination, and
argument hash. A permitted action is routed through an approved MCP tool
when one can perform it, but the MCP envelope is evaluated again; routing
never bypasses policy.

Every denial names the category and rule. Legitimate near-matches pass.
Adapters emit no hook/config on axes the vendor genuinely does not support.
The instruction rule still requires policy compliance and status reports the
mechanical gap.

### 8.7 Sanitation and bounded remediation

When `sanitation.harness` is enabled, the accepted review and harness digest
are installed under `.rig/baseline/`. Adopt-time, on-demand,
changed-harness pre-commit, and enabled CI triggers use the same bounded
static detector; semantic review maps only to `ALLOW`,
`ALLOW_WITH_RESTRICTIONS`, `QUARANTINE`, or `BLOCK`.

When disabled, those triggers do not restrict onboarding or work. No verdict
is created or reused, and status records `disabled`/`not_run`.

Remediation proposal generation is read-only. A proposal contains only typed
operations, exact target paths, input preimages, expected output hashes, and
the complete expected diff. Applying it requires user-presence approval of
the exact proposal digest. Apply rechecks all preimages, rejects stale or
empty/no-op work, acquires the normal exclusive transaction lock, and journals
each write under §7.6 with `transaction_kind: "remediation"`. A successful
transaction uses `operation: "remediate_user_content"` and ends each entry at
`committed_user_change`; those user-approved
content changes remain in the working tree and uninstall ignores them. On any
partial failure, Rig restores every changed preimage and appends a
`rolled_back` superseding record with the restored digest for each entry. A
rollback failure is named and nonzero. Resume and uninstall consider only live
installation entries, so neither treats a restored remediation write as an
installed artifact or a digest conflict. Any observed write outside or
different from the approved diff triggers the same rollback. After an exact
successful write set, Rig runs sanitation again and publishes only that fresh
result.

### 8.8 Drift and secret controls

`.rig/baseline/drift-rule.md` tells the host agent to update central
context, point secondary contexts to central sources, register unavoidable
byte duplicates, and report uncertain semantic drift instead of rewriting
intent. The repo's documents are the memory; there is no hidden learning
store.

When `drift.exact_copy` is enabled, `.rig/bin/check-copies.js` canonicalizes
paths below the repo, rejects missing/escaping files, compares bytes, emits
minimal context, and returns nonzero on drift at each enabled git/CI
surface.

When `drift.semantic` is enabled, the host reviewer compares
`.rig/context-index.json`, changed files, canonical/deprecated
relationships, and current input digests. Missing, malformed, stale, or
note-only reviewer output is a gap, never a pass.

**Matched secret content does not reach the model by default (D16,
`AT-SECRET-1`).** Secret detection is deterministic — `secrets.deterministic`,
the staged regex floor, and the vetted external scanner of §7.3 — and never
delegated to the host's model. Detection produces two separated outputs: a
**disclosable** record of counts, rule identities, and locations, and a
**restricted** record holding matched content, which is written only to the
local report under the redaction of `AT-B3` and `AT-REPORT-1`. Everything
Rig hands the agent is built from the disclosable record.

Model-assisted triage flips this, and only the user can flip it. Enabling it
is an explicit policy change activated the same way as any other, and the
point of enabling states the reason in the user's own terms: the host's
model is a third party, and a credential in a third party's context cannot
be unsent.

**The channel is one gated field, closed by default (`AT-SECRET-1`).** With
`secrets.model_assisted_triage` false — the shipped default — every string that
crosses into the agent's context is built from the disclosable record alone; the
restricted record holding matched content is written only to the local redacted
report and never assembled into agent-visible output. When the active policy has
that field true, the detection pipeline additionally attaches a bounded
`matched_content` field to each finding in the agent-visible triage view — the
matched span and just enough surrounding bytes to triage it, with host-rooted
paths and unrelated adjacent secrets still redacted. That field is present only
while the leaf is active and is dropped the instant it is deactivated (a fresh
evidence epoch, so no prior triage output is reused as current). The gate is the
single field: no other code path assembles matched content into agent context,
so the case has one place to open and one place to test.

When `secrets.deterministic` is enabled, the dispatcher runs the
high-precision patterns and tracked-`.env` block over staged or whole-repo
scope as applicable. This control is independent from the selected
Product-Security leak-scanner service.

First enabling that service enters `pending_history_scan`. Rig discovers a
configured vetted scanner and runs its documented full-history mode with
`shell: false`. A clean run activates the service. A finding, missing
scanner, unsupported version, timeout, malformed output, concurrent
history/config change, or execution failure is nonzero and writes an
actionable redacted report. A waiver is available only for an actual current
finding set, bound to exact scanner/version, repository/ref state,
configuration, and finding-set digest.

### 8.9 Git/CI dispatch and truthful evidence

For each trigger, a control runs only when both its leaf and the enforcement
surface are enabled. The pre-commit order is:

1. changed-harness sanitation;
2. exact-copy drift;
3. deterministic staged-secret checks;
4. selected Product-Security checks;
5. the preserved user hook.

`.rig/bin/check.js --scope repo` runs all enabled repo-applicable controls
and every selected executable service that is repo-CI-applicable at its active
grade, in dependency order. This is D22's active-grade interpretation of
`AT-CI-3`'s selected executable services. CI applicability is a property of a
service's active grade, not of whether a Rig CI job happens to exist: lint-format is
repo-CI-applicable only at the Evidence grade (§11.3), so a lint-format leaf
selected at Policy or Context grade does not run in this job and acquires no CI
enforcement, even when another control or service caused a Rig CI job to exist.
Disabled leaves/surfaces, and services not CI-applicable at their active grade,
are listed as disabled/unrun; they do not execute and do not block. Failure in a
Rig check does not suppress the preserved user hook unless the approved fail-fast
contract explicitly says the commit is already denied.

Every result is bound to `control_id`, `surface_id`, active policy digest,
enablement generation, implementation digest, and input digest. Disablement
invalidates the current generation. Re-enablement creates a new generation
and status remains `pending`/`not_run` until fresh evidence exists. Allowed
status states are `disabled`, `not_run`, `pending`, `coverage_gap`, `failed`,
and `verified`. None may be relabeled as protected/scanned/passed/verified
without current-epoch evidence. Here `verified` is a control/tool status
meaning the leaf holds fresh current-epoch evidence; it is a distinct concept
from the withdrawn host/axis tier vocabulary of §11.1 and never appears as a
per-host claim in install output or run reports.

## 9. Runnable Services and Reports

### 9.1 Binding schema

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

No binding is executed during inspection, recommendation, planning, or
apply. Execution uses `spawnSync(command, argv, { shell: false })` with an
explicit working directory and timeout. Unknown executables, missing
bindings, timeouts, malformed output, known generic-success stubs, and
processes that were never launched are coverage gaps or failures, never
green passes. The runner iterates the selected service receipt, not the
binding keys, so a missing binding cannot disappear through omission.

Convention dispositions name an installed-state verifier in the same
receipt; they do not receive argv. Surfaceless dispositions name their
predicate and specific reason. The source-side CLI and materialized
`.rig/bin/check.js` share one generated runner contract and fixtures so
local and CI behavior cannot diverge or silently skip different cases.

### 9.2 Run scope

- Development/pre-commit defaults to changed files or the staged diff.
- CI uses whole-repo scope.
- The testing ladder is fail-fast. A failed earlier rung marks later rungs
  `not_run_due_to_dependency` in the failing report rather than pretending
  they passed.
- Only declared surfaceless services whose predicate holds exit successfully
  with a `vacuous` report containing the exact reason. An executable
  service lacking a surface/binding is a nonzero `coverage_gap`.

### 9.3 Report schema

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

Run-report status values written to disk are `failed`, `vacuous`,
`coverage_gap`, `timeout`, `cancelled`, `missing_dependency`, `signalled`,
`partial_output`, and `command_not_found`. The last six are distinct abnormal
non-passing results, never collapsed to `failed`. Control/policy status is a separate enum — `disabled`,
`not_run`, `pending`, `coverage_gap`, `failed`, and `verified` — required by
§8.9, where `verified` means the leaf holds fresh current-epoch evidence and is
not a host/axis claim. Routine
current-epoch pass reports are omitted. Local report names use a timestamp
plus content hash and exclusive creation to avoid concurrent writers.

Security findings use the same evidence/fix-context conventions plus the
frozen verdict enum. All secret-shaped evidence is redacted before writing.

**A report stays on the machine that produced it (D15, `AT-REPORT-1`).**
`reports/rig/` is written inside the repository and excluded from version
control by a managed `.gitignore` block that install adds and uninstall
removes, recorded in the §7.6 manifest like any other write. Rig never
commits a report and **never uploads one as a build artifact**.

The exclusion is only half of it, because a job log is as public as an
artifact. In CI a failing check emits a **verdict, finding counts, and rule
identities**, and nothing else — no matched content, no surrounding lines,
no file excerpts. Paths are named only where the rule identity already
implies them. On a public repository a secret-scan report is a map of the
repository's secrets, and the log is the easier of the two to read. The
`AT-B3` redaction still applies underneath.

### 9.4 Plan-bound read-only execution, autofix, and drift (lint-format)

Lint-format runs the repository's own discovered commands, which is running the
repository's own untrusted code. This subsection is how that stays bounded.

**Plan-bound consent (`AT-LF-5`, GA-25/26).** Selecting the leaf in `rig.json`
authorizes nothing to run. Only a plan the user approves at its exact digest
(§6.6) authorizes execution, and it authorizes exactly the listed read-only
commands, working directories, and components — nothing else. The plan discloses
in plain words that repository-declared tasks are the repository's own untrusted
code, run under Rig policy, least privilege, secret isolation, network
restriction, and resource/time limits, and that `shell: false` (§9.1) bounds
only the argv boundary and is **not** a safety guarantee. Any pre-approval
execution, any command not in the approved plan, or a `shell: false` safety
claim fails `AT-LF-5`.

**Shell-trust guarantees (`AT-LF-20`–`AT-LF-24`, GA-37/26/33).** `AT-LF-5`'s
disclosure names the controls; these five pin what each one concretely
guarantees. **(20) Single-use approval:** a plan approval authorizes exactly
one execution of its exact plan digest; presenting the same approval for a
second execution is refused, not re-authorized. **(21) Filesystem/env
isolation:** a command's working directory and every path it touches must
resolve inside the repository even through a symlink, and it receives no
ambient environment variable beyond an explicit allowlist. **(22) Network
denial:** a command not explicitly granted network access by the plan has no
outbound reachability; a command explicitly granted it may connect.
**(23) Resource/time caps:** a command exceeding a configured memory ceiling
or wall-clock timeout is killed and reported as its own distinct non-passing
state (§9.4's abnormal-ending taxonomy below, `GA-33`), never left hanging or
silently truncated. **(24) Symlink escapes:** a repository-supplied symlink
whose real target resolves outside the repository is refused for read,
write, or working-directory use, never followed because its lexical path
looks contained. `AT-LF-20` is implemented (`executePlan` consumes a matching
approval on a successful execution and refuses the same approval on replay).
`AT-LF-21` is now enforced at task spawn: working directories resolve through
the same containment check as other repository paths, and the child
environment is an explicit allowlist rather than inherited `process.env`.
`AT-LF-22` is implemented in the approved-command paths (network isolation).
`AT-LF-23` is implemented (timeoutMs kill-and-report). `AT-LF-24` is
implemented: `planExecution` resolves real paths before snapshotting and
refuses a read whose target escapes the repository through a symlink. The
five guarantees are fully implemented on the interactive lint-format
plan/grade path. The non-interactive CI floor runner deliberately has no
plan/approval seam under GA-38; it enforces containment, resource ceilings,
three-state network handling, and committed-policy capability authority.

**Diff scope and locality (`AT-LF-10`, GA-28).** The default scope is the
component's changed files (§9.2's development default), run inside the
component's working directory and honoring the component's own ignore rules. The
user may request whole-repository or another explicit scope; Rig never silently
widens it. A clean or ignored file touched under default scope, a whole-repo
default, or a run from the wrong directory fails `AT-LF-10`.

**Read-only guarantee (`AT-LF-11`, GA-27).** Before running the approved
read-only commands, Rig records content digests of the in-scope working-tree
paths; after each command it re-checks them. On any mutation Rig stops before
the next planned command, fails the check, and reports the exact changed paths
with before/after evidence. It does **not** auto-restore — that would clobber
concurrent user work and erase the forensic record of a misbehaving tool — and
does **not** continue. An auto-restore, a continuation, or a pass fails
`AT-LF-11`.

**Autofix (`AT-LF-12`, GA-29).** Autofix is a distinct mutating action, never
folded into or triggered by a read-only check. It runs only when the user
explicitly invokes a fix command under its **own** separate verified approval,
distinct from the read-only check approval. Rig offers both format fixes and
safe lint fixes, applies them, re-verifies by re-running the read-only check,
and leaves the result as uncommitted working-tree edits the user owns — never
committed, never claimed as Rig's source. Binding that approval token to the
exact fix argv remains an acknowledged hardening gap outside the frozen
`AT-LF-12` contract. Autofix folded into the check, auto-committed, or run
without its own approval fails `AT-LF-12`.

**Command drift (`AT-LF-14`, GA-31).** Each approved binding carries the digest
of the exact command text and target it was approved against — the §8.5
changed-bound-field rule applied to a plan binding. When execution reaches a
task whose current repository definition no longer matches that digest, Rig
stops before running it, does not run the changed command, discloses the exact
drift, and requires a freshly rediscovered plan the user approves before
resuming. A changed command is a new command; running the changed task under the
old approval, or running the stale approved text, fails `AT-LF-14`.

**Abnormal endings (`AT-LF-16`, GA-33).** Every non-verdict ending resolves to
its own distinct, reported, non-passing state — `timeout`, `cancelled`,
`missing_dependency`, `signalled`, `partial_output`, and `command_not_found`,
each naming exactly why. These extend the executable runner's §9.2/§9.3
run-report status set. None collapses into `pass` or a generic `failed`, and an
inconclusive end is non-passing and blocking, never treated as non-blocking.
Collapsing any ending fails `AT-LF-16`.

**Local, redacted, actionable report (`AT-LF-15`, GA-32).** Lint-format reports
follow §9.3 and §8.8 exactly: they stay on the producing host under
`reports/rig/`, keep failure/vacuous/gap state and omit routine passes, redact
secrets, PII, and host-rooted data on the producing host before anything leaves
it, and explain each finding as an actionable item rather than a raw dump. In CI
only verdict, counts, and rule identities are emitted, and matched secret content
reaches the agent only under the default-closed `secrets.model_assisted_triage`
opt-in of §8.8. Any leaked detail, uploaded artifact, or default secret exposure
fails `AT-LF-15`.

## 10. Trust, Safety, and Failure Boundaries

| Boundary | Required behavior |
|---|---|
| Target path | Realpath beneath target; reject traversal and escaping symlinks. |
| `rig.json` | Strict object/enum/ID validation; reject unknown service, grade, host, and value-shaped credential. |
| Candidate policy | Bounded exact bytes; strict duplicate/unknown-key/schema rejection; never used for enforcement until approved. |
| Active policy | Exact snapshot digest, repository/sequence-bound verified attestation or signature, atomic receipt last; fail closed on missing/stale/replay. |
| User-presence trust | Verified host attestation or external signer outside the repo; repo flags, TTY text, and unattended keys are insufficient. |
| Policy signer recovery | Pre-registered `sk-*` SSHSIG recovery identity under `rig-policy-recovery`; registration must predate loss and be signed by an already-valid credential. No ordinary prompt, same-key recovery, unregistered fresh key, or reset fallback can replace the signer. Recovery side effects occur only after the receipt commits. |
| One-use approval | Clone-local, complete action binding, exclusive atomic consumption before dispatch, no retarget/replay/share. |
| Host action event | Axis-specific schema validation and normalization; malformed/unknown event is a gap/deny per the contract, never implicit allow. |
| Source fragments | Catalogue allowlist only; verify source catalogue digest before use. |
| Harness scan | Read as bytes; never execute/import/source; bounded size and redacted evidence. |
| Review artifact | Strict schema, current harness digest, fail closed on missing/unverifiable data. |
| Dependency graph | Valid target/slice, acyclic, deterministic fixed point. |
| User files | No replacement/deletion; malformed structured config blocks. |
| Commands | Argv arrays, `shell:false`, timeout, explicit cwd, no scan-time execution. |
| Service binding | Explicit disposition; discovered executable and real launch evidence; missing/malformed/no-op/silent binding is nonzero. |
| Remediation | Read-only exact proposal, user-presence approval, preimage CAS, transactional observed-diff equality, no-op rejection, rollback, fresh sanitation. Remediation entries use explicit `committed_user_change`/`rolled_back` terminal journal states; uninstall ignores both, while rollback restores and records the observed preimage digest. |
| CI config | Provider-native adapter, namespaced additive ownership, exact plan approval, collision refusal, least privilege, real first wire. |
| Reports | Repo-local, schema-validated, redacted, no telemetry. |
| Concurrent apply | Exclusive lock plus before-hash compare-and-swap. |
| Partial failure | No rollback (§6.6/§7.6, `AT-INSTALL-1`): applied writes stay, the manifest records exactly how far apply got, the absent final receipt marks the install incomplete, and re-running resumes rather than restarting or duplicating. |
| User-global file | Append or namespaced additive merge only; every pre-existing value survives byte-for-byte; entries attributed to the writing repository from the first install; removal touches only this repository's entries. |
| Install identity | Generated, clone-local, never committed; a linked worktree is a distinct installation. |
| Gate 1 integrity | Recomputed digests plus a namespaced SSHSIG signature verified against the listed signer identity; fail closed on a missing, malformed, or non-verifying signature when armed. The key's class is attested by the intent owner and is not checkable from the artifact (D19). No git dependency. |
| Host emission | Every `{host, axis}` in the roster is emitted through one uniform path (§11.1); an `unsupported` axis emits nothing and cites the vendor absence; no code path skips a host. |
| Install stub | Fetches a released tag by name; downloads to a file before executing; never pipes network output to a shell. |
| Test target | Every target named in §13 must exist and must report results; a missing file is a coverage gap, never a pass. Runner exit codes are not trusted alone, because `node --test` exits 0 for a target it could not find. |

No network access is required for onboarding mechanics. A selected service
may later call an existing repo tool that uses network access, but its
shell/web/MCP action is normalized and evaluated like any other action.

## 11. Host and CI Coverage (One Uniform Path)

### 11.1 Host contracts

The roster is exactly:

`claude`, `codex`, `cursor`, `windsurf`, `cline`, `kiro`, `gemini`,
`copilot`, `opencode`, `pi`, `hermes`, `copilot-cli`, `antigravity`,
`codewhale`, `openclaw`, `devin`, `swival`, `vscode-codex`, and `generic`.

Host identity remains `devin` = Devin CLI and `windsurf` = Devin Desktop
(formerly Windsurf); Cloud Devin is out of scope. The registry carries
axis-local entries for `instruction`, `native_skill`, `shell_hook`,
`web_hook`, `mcp_hook`, and `mcp_config`. Git and CI remain separate
deterministic surfaces.

**Every `{host, axis}` in the roster is on one uniform emission path.** No
axis is a second-class citizen carrying a degraded surface; no axis is a
first-class citizen carrying a tier badge. Emitted axes all carry the same
shape of contract and are proven the same way:

| Emission | Meaning | Release-blocking? |
|---|---|---|
| emitted | The axis has a complete contract (below) and its byte-landing test lands the correct bytes on a fresh target. | Yes — a missing contract or a failing byte-landing test blocks release. |
| unsupported | The vendor exposes no surface at all for this axis. The registry cites the absence; nothing is emitted. | No. |

There is no `verified` label, no `advertised` label, and no `advisory` tier on
any host or axis: those two emissions are the whole vocabulary. An axis either
has a complete contract and emits, or the vendor exposes no surface and it is
`unsupported`; an instruction pointer standing in for a missing mechanism is
not a third state. This host/axis emission vocabulary is distinct from the
control/tool evidence status of §8.9 and §9.3, where `verified` legitimately
means a control leaf holds fresh current-epoch evidence. The distinction the
withdrawn tier drew — "we shipped this" versus "we have watched enforcement
fire" — does not appear anywhere in the emitted product. The honest observation
that Rig has not observed enforcement fire on any host lives in the
**registry header** as a single product-level statement; a user who reads
the registry finds it there.

The `emitted` contract for each axis:

```json
{
  "host": "gemini",
  "axis": "shell_hook",
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
    "native_user_presence": "<exact protocol or null>",
    "external_signature_fallback": "<exact adapter handoff>"
  },
  "evidence": {
    "vendor": "<vendor>",
    "version": "<version>",
    "official_citation": "<exact surface/behavior URL>",
    "adapter_digest": "<sha256>",
    "fixture_digest": "<sha256>",
    "byte_landing_test": {
      "target": "tests/advanced-hosts.test.js",
      "case": "<test-case name>",
      "assertion": "the exact bytes above land at the exact path above on a fresh target"
    }
  }
}
```

Rules:

- every `emitted` axis has a complete contract and a passing byte-landing
  test; the two are not substitutable — a contract without a test does not
  ship, a test without a contract does not either;
- evidence is owned by one `{host, axis}` pair and cannot be reused as a
  host-level umbrella citation;
- adapter/config byte changes invalidate the byte-landing test result;
- an `unsupported` axis cites the vendor absence and emits nothing; this is
  the only status permitted to emit nothing;
- `mcp_config` additionally records `repo`, `user_global`, or `unsupported`.
  User-global emission uses the §7.4 attributed-append mechanism; a fabricated
  repo path is forbidden;
- `pi` MCP is `unsupported` in both catalogue and legacy Basic paths. Fresh
  installs emit no `.omp/mcp.json`. Existing user-owned content is preserved
  byte-for-byte and receives migration guidance rather than deletion;
- every instruction-capable host receives pointers to the catalogue router
  and policy/guide; no host receives a Rig model key.

The current registry's aggregate citations and
`.rig/hooks/semantic-review.hint.md` markers do **not** satisfy this
contract. As of v0.12, no host axis holds a complete emitted
bundle. Every axis moves to `emitted` as its contract is authored and its
byte-landing test is added; the axes for which the vendor exposes no surface
are `unsupported` from the outset.

The registry's header records — once, in prose — that Rig documents each
surface but has not observed enforcement fire on any host. This statement
appears nowhere else. It is not repeated per host, not projected into install
output, and not repeated in run reports. The 2026-08-17 amendment removed
every per-run channel it used to travel through.

Host tests exercise each emitted adapter's real event fixture, normalized
policy decision, deny/proceed response, preservation boundary, first and
repeated apply, and byte-landing on a fresh target. The common service
payload remains centralized, so those tests do not duplicate all 115 service
assertions.

### 11.2 CI provider, integration, and bootstrap contracts

The provider roster is exactly `github-actions`, `gitlab_ci`, `circleci`,
`jenkins`, `buildkite`, and `azure_pipelines`. Each provider uses the same
one-uniform-path rule as host adapters: provider/version, exact config paths
and schemas, owned merge boundary, collision behavior, minimum permissions,
verdict-emission form, first/repeated apply, official documentation,
adapter/fixture digests, and a passing byte-landing test.

CI detection yields one of:

- `verified_existing`: a supported provider config parsed by its exact
  adapter;
- `absent`: no provider config detected;
- `unknown`: a config exists but no verified adapter owns its shape;
- `malformed`: the matching provider config cannot be safely parsed;
- `collision`: Rig's standalone path/namespace is already user-owned.

For `verified_existing`, the content-bound plan adds one namespaced Rig job
or step that runs `.rig/bin/check.js --scope repo` and emits a verdict with
finding counts and rule identities. It uploads nothing and prints no finding
detail (`AT-REPORT-1`). The merge preserves all unrelated jobs, values,
permissions, comments/format where the adapter contract promises them, and
user secrets. Apply requires exact plan approval and is idempotent.

For `absent`, Rig does not guess a provider and plan writes nothing until the
user explicitly selects one of the six providers. The resulting minimal
provider-native pipeline requires exact plan approval before creation. It
requests only documented minimum permissions, references no repository
secrets, runs all enabled repo-applicable controls and every selected executable
service that is CI-applicable at its active grade (§8.9), and emits the same
verdict-and-counts output with no artifact upload.

`unknown`, `malformed`, and `collision` return nonzero, record the exact
reason, and preserve every byte.

Every new or merged target integration is proven by its byte-landing test on
a fresh repo fixture: the adapter version, config digest, active policy, and
effective binding manifest produce the exact expected job/step bytes at the
exact expected path. That test is the release evidence. Provider adapters do
not distinguish "installed" from "watched running": every provider ships
through the same test path.

Disabling `ci.repo` transactionally removes or disables only the receipt-
owned Rig integration. User jobs/config remain unchanged. Any external
branch rule that still requires the old Rig job is outside repository control
and is reported as a remaining enforcement dependency rather than silently
modified.

### 11.3 Lint-format CI at the Evidence level (`AT-LF-13`, GA-30)

The Evidence grade (§5.7) is the level that enforces lint-format in CI,
whole-scope at the gate. Because repository-CI applicability is grade-aware
(§8.9), a lint-format leaf at Policy or Context grade does not run in
`.rig/bin/check.js --scope repo` and acquires no CI enforcement even when a Rig
CI job already exists for another control or service; only the Evidence grade
makes lint-format repo-CI-applicable. The CI graft **reuses §11.2 and AD-23
unchanged**; lint-format adds no new CI machinery, only the trigger:

- `verified_existing` CI receives one additive namespaced job running
  `.rig/bin/check.js --scope repo` and emitting a verdict with counts and rule
  identities; unrelated jobs, values, and secrets are untouched;
- `absent` or `unsupported` CI gets **nothing written** until the user selects
  one of the six providers (§11.2) and approves a separate plan;
- `unknown`/`malformed` CI is preserved and reported, never edited or replaced.

Selecting the Evidence grade **proposes** this gate; it never auto-creates or
owns CI on selection alone. The gate uploads nothing and prints no finding
detail (§9.3, `AT-REPORT-1`), which is `AT-LF-15`'s CI half. A silent edit of an
unknown pipeline, an auto-created CI on grade selection alone, or a clobbered
unrelated job fails `AT-LF-13`.

The CI graft is an enforcement surface, not a constituent of the local
Evidence verdict. A completed local Evidence run remains Evidence when CI is
absent, unknown, or awaiting the separate plan approval; status reports that CI
state without claiming repository-gate enforcement. Once the graft is active,
whole-scope CI runs are required for current CI enforcement evidence.

Lint-format's install/removal lifecycle adds nothing to §7.6 either:
reinstall is the idempotent resume of §7.6 that claims no protection until
complete (`AT-LF-17`), and removal is the reverse-`seq` manifest walk that
reverses exactly the generated CI, configuration, and managed blocks Rig
recorded and leaves the user's autofix source edits — ordinary uncommitted
working-tree changes, never manifest entries — untouched (`AT-LF-18`).

## 12. Compatibility and Rollout

### 12.1 Legacy CLI

No-subcommand legacy invocation follows the current Basic code path and
keeps its acceptance tests green. Catalogue manifests are identified by
`schema_version` and used only with new subcommands.

### 12.2 Existing Basic target

Adoption order:

1. read the Basic receipt if present;
2. compare legacy payload candidates against shipped byte digests;
3. adopt only proven Rig-owned entries;
4. treat everything else as user-owned;
5. strictly parse and preflight existing host configs, then call existing MCP
   renderer shapes only through the Infrastructure compatibility slice and
   never for an `unsupported` host such as `pi`;
6. preserve a pre-existing user-owned unsupported MCP file and emit
   migration guidance; remove only receipt-proven Rig-owned entries through
   an explicitly approved migration;
7. establish the safe default policy/active snapshot without treating legacy
   config as a user approval;
8. write the new catalogue receipt without deleting the Basic receipt.

There is no automatic destructive migration. The catalogue path never
reaches the legacy renderers' malformed-JSON fallback.

### 12.3 Release gate

The catalogue path ships only when these checks pass in order:

1. the first-running oracle verifier confirms the v2 owner signature over
   both Gate 1 digests and `testing-infrastructure.manifest`, then confirms
   every sorted path/digest entry before any product test runs;
2. the technical specification is present as the sole current technical
   approach and the 95-ID traceability table names an existing substantive
   executable target for every current Gate 1 case;
3. every Gate-1-derived executable target passes without modifying the signed
   oracle, including all 115 leaves under `AT-SHAPE-6`;
4. all 115 leaves pass mechanical authorship checks and the fresh-context
   exact-digest semantic/MECE review at declared Policy grade; lint-format's
   additional Context/Evidence targets also pass;
5. every recognized host remains reachable through the uniform adapter path,
   automatic onboarding emits only detected hosts, explicit opt-in is the only
   absent-host override, and each emitted axis passes its byte-landing test;
6. all six CI providers pass their additive/bootstrap/unknown-config matrix;
7. all 55 vendored skills are materialized under their unique Rig names and
   every installed copy carries `LICENSE.upstream` and `UPSTREAM.md` without
   an upstream-endorsement claim;
8. a no-checkout fixture installs named-tag version `5.0.0` through a
   downloaded-before-execution root stub and records the resolved tag;
9. legacy Basic and Tier 1 suites remain green, the fresh report-only release
   review is digest-pinned with no unresolved finding, and `npm test` passes
   on the same final source state.

The owner signature is created before implementation and merely reverified at
release. Any changed oracle byte invalidates it and returns the change to the
key holder; the technical specification may change without re-signing.
### 12.4 Distribution

A stranger with `git`, `curl`, and `sh` and no checkout must be able to
install Rig.

**The stub.** `install.sh` is committed at the repository root. A stranger
fetches it at a released tag and runs it. It resolves a released version
tag from GitHub by name, defaulting to the latest release, and accepts an
override for a specific one.

It does not embed a build fingerprint. A fingerprint only helps when it is
harder to tamper with than what it fingerprints, and the stub and the
source come from the same repository — anyone able to re-point a tag can
equally edit a constant sitting beside it. Guarding against accidental
retagging is a repository setting (tag protection), not installer
machinery.

**The stub never pipes the network into a shell.** It is downloaded to a
file and then executed. Rig's own default policy denies
`remote_content_execution`, and an installer that breaks the product's rule
in its first five seconds cannot be defended.

**Every install resolves to, and records, one concrete tag.** `latest` is a
selector, not a reference: the stub resolves it to a specific release tag
before fetching anything, and writes that exact tag into the install
receipt. Two strangers installing a month apart may receive different
versions — that is what "latest" means — but each install is afterwards
identifiable, reproducible by name, and never sourced from a moving branch.

**Release plumbing.** The inherited npm publish workflow is deleted: the
package is `private`, so tagging a release would otherwise fail on a
publish step that was never going to succeed. `package.json` moves to
`5.0.0` and stays `private`. The repository's default branch is `prod`; no
workflow may reference `main` or `master`.

**Vendored payload.** The released archive and every materialized installation
carry all 55 skill directories plus `rig/catalog/skills/LICENSE.upstream` and
`rig/catalog/skills/UPSTREAM.md`. Skill registry generation fails on a missing
directory, duplicate/invalid Rig name, or missing notice/provenance file. User-
facing install output names the upstream source and MIT licence but makes no
endorsement claim.

## 13. Acceptance Traceability

The oracle coverage check extracts the distinct acceptance IDs from Gate 1 and
requires exact set equality with the primary rows below, currently **95
IDs**. Every row must name an existing design anchor and a substantive
executable test title containing the same ID. Explicit evidence aliases are
permitted only for Gate-1 properties that point to another case;
tautological assertions are not.

Set equality is asserted against Gate 1 as read from disk, not against a
number written here. The count above is documentation; if it disagrees with
the file, the file wins and the gate fails.

**Every named executable target must be proven to exist and to have run.**
`node --test <missing-file>` prints `Could not find` and **exits 0**, so a
traceability row naming a test file that does not exist would otherwise
read as green. The gate stats every target named in the table and fails on
absence, and the runner asserts that each named target actually reported
results rather than trusting an aggregate exit code.

| Gate 1 case | Design mechanism | Primary executable evidence |
|---|---|---|
| AT-GATE-1 | §12.3 checks one present technical approach without signing or freezing it; subordinate normative documents trace to its anchors and cannot override the oracle. | `tests/advanced-spec-gate.test.js` title `AT-GATE-1 one current technical approach`: reject a missing/second approach or orphan normative ruling; prove a technical-spec edit does not invalidate the oracle signature. |
| AT-GATE-2 | AD-28's oracle verifier is first in `npm test`: it verifies the v2 signature over both Gate 1 digests plus the test-manifest digest, then verifies every manifested file before code tests. | `tests/advanced-spec-gate.test.js` title `AT-GATE-2 signed oracle runs before code`: exercise unarmed reporting; armed missing/malformed/wrong-namespace signatures; mutations to each Gate 1 file, manifest, and listed test; signer substitution disclosure; and a code sentinel proving short-circuit order. |
| AT-GATE-3 | AD-29 produces a fresh-session report-only release-review receipt bound by the wrapper to exact technical-spec and catalogue digests with one verdict per current ID and `unresolved=[]`. | `tests/advanced-spec-gate.test.js` title `AT-GATE-3 review is fresh report-only release evidence`: reject stale, incomplete, same-session, self-bound, or unresolved receipts without treating review as implementation authorization. |
| AT-GATE-4 | Workflow receipts use distinct implementation and review context/run IDs, not named staff; implementation diffs cannot change the signed oracle or self-approve. | `tests/advanced-spec-gate.test.js` title `AT-GATE-4 workflow separation is not staffing`: accept one maintainer with distinct contexts; reject same-context approval and changed manifested oracle bytes. |
| AT-SHAPE-1 | All leaves/grades use the typed ownership/CAS/rollback graft path; no pack can bypass it. Every insertion into a file Rig does not exclusively own is delimited by managed-block markers, and every mutation is recorded in the §7.6 manifest at the time it is made. | `tests/advanced-oracle.test.js` title `AT-SHAPE-1 grafts and journals without clobbering user bytes`: Iterate 115 leaves x 3 grades against seeded user instructions/config; preserve bytes/keys and prove idempotent repeat apply. Assert every write is bracketed by markers and has a manifest record whose digest matches the file after the write; assert an unmarked or unrecorded write is impossible by driving each graft path and diffing the observed write set against the journal. |
| AT-SHAPE-2 | Recommendation emits every leaf but resolution consumes only user-confirmed `rig.json`. | `tests/advanced-oracle.test.js` title `AT-SHAPE-2 recommendation never prevents an explicit service choice`: A UI-less library marks E2E not recommended, then user selection still plans/applies it. |
| AT-SHAPE-3 | Identity is grade-invariant; fragments/check sets are strict cumulative supersets. | `tests/advanced-oracle.test.js` title `AT-SHAPE-3 grades preserve identity and grow cumulatively`: Catalogue-wide 115-leaf grade set and identity test. |
| AT-SHAPE-4 | Deterministic named-slice fixed point preserves explicit grades and cannot represent whole-group pulls. | `tests/advanced-oracle.test.js` title `AT-SHAPE-4 dependency resolution pulls only named slices`: Missing/lower-grade/transitive/cycle fixtures prove only exact slices are added. |
| AT-SHAPE-5 | Executable is the default disposition and is attempted first (AD-15); `convention` is a fallback that must carry a service-specific named reason, and only `surfaceless` may be vacuous. | `tests/advanced-oracle.test.js` title `AT-SHAPE-5 every selected service reports one honest disposition`: Inject failing real process, convention verifier, valid vacuity, and missing/empty/`true`/`echo`/`process.exit(0)` bindings; separately prove a convention whose reason is generic, absent, or byte-repeated across services scores as a coverage gap. |
| AT-SHAPE-6 | §5.6 authored fields, declared Policy/untailored status, anti-filler gate, exact 26/40/31/18 inventory, and fresh all-leaf semantic-review receipt. D24 retires D23. | `tests/advanced-oracle.test.js` title `AT-SHAPE-6 all 115 leaves are authored at their declared grade`: reject TODO/generic/repeated/missing content, missing grade/status declarations, false higher-grade claims, and stale/incomplete 115-leaf review receipts. |
| AT-BASE-1 | Safe shipped policy runs sanitation first; an exactly activated disablement continues with disabled/not-run state and no verdict. | `tests/advanced-oracle.test.js` title `AT-BASE-1 sanitation precedes profiling unless exactly disabled`: Prove default ordering and separately prove approved disablement unlocks menu without clean/protected evidence. |
| AT-BASE-2 | One evaluator and action envelope govern shell/web/MCP adapters; genuinely unsupported surfaces are explicit gaps and MCP is re-evaluated after preferred routing. | `tests/advanced-oracle.test.js` title `AT-BASE-2 one policy governs shell web and MCP surfaces`: Equivalent allow/deny actions across all three surfaces plus unsupported-axis and no-MCP-bypass fixtures. |
| AT-BASE-3 | Install authoritative `.rig/network-policy.json`, explanatory `.rig/network-rules.md`, and pointers to both; enforcement reads active JSON only. | `tests/advanced-oracle.test.js` title `AT-BASE-3 structured active policy is authoritative and discoverable`: Conflicting prose cannot change a decision; every host instruction locates both artifacts. |
| AT-BASE-4 | §8.3/§8.4 exact-byte digest, active snapshot, session-scoped and unpersisted proposal-authoring delegation, verified host-native or external user-presence approval, repository/sequence binding, and replay rejection. | `tests/advanced-oracle.test.js` title `AT-BASE-4 activation binds exact revision and current-session proposal authority`: Accept both activation paths; accept an agent proposal only under a current explicit request. Reject delegated edit as activation consent, byte edits, wrong repo/sequence, copied receipt, invalid signature, unverified prompt, unsigned candidate, and base prompts that imply prior approval or delegation can authorize activation. **Assert no delegation grant is written anywhere** — scan the repository, the clone-local Rig directory, and every user-global surface after granting delegation — and assert a fresh session asserting delegated edit mode is refused. |
| AT-BASE-5 | Explicit independent control/surface leaves, group/global authoring expansion, actual unwiring/non-blocking, unrelated function continuity, and truthful status. | `tests/advanced-oracle.test.js` title `AT-BASE-5 disabled controls stop blocking and status says unprotected`: Disable one control, one surface, one category, then all enforcement; verify requested effects and every status label. |
| AT-BASE-6 | Evidence keys include policy digest, control/surface, enablement generation, implementation, and inputs; disable invalidates and re-enable increments. | `tests/advanced-oracle.test.js` title `AT-BASE-6 re-enable creates a fresh evidence epoch`: A pre-disable pass cannot verify the re-enabled generation until a fresh run completes. |
| AT-BASE-7 | §8.2: no schema key can express self-activation, unknown keys are rejected at activation step 1, and the approval requirement has no policy-driven branch around it. Not held in a second file or repository. | `tests/advanced-oracle.test.js` title `AT-BASE-7 policy schema cannot authorize agent self-activation`: Author policy revisions that purport to grant agent self-activation under plausible key spellings and assert each is rejected at validation and never becomes active. Assert that no activation path consults policy to decide whether approval is required, by mutating each policy field in turn and asserting the approval check still runs. Disable enforcement wholesale under `AT-BASE-5` and assert status reports unprotected rather than protected. Assert no separate invariant file or repository exists for this rule. |
| AT-P1 | Same exhaustive typed graft evidence as AT-SHAPE-1; aliases must resolve to its real parameterized test. | `tests/advanced-oracle.test.js` title `AT-P1 no-blowout is proved by the real graft contract`: `AT-P1` runs the AT-SHAPE-1 target directly: 115 leaves x 3 grades against seeded user instructions/config, marker-bracketed writes with a manifest record whose digest matches the post-write file, and an unmarked/unrecorded write proven impossible by diffing the observed write set against the journal. No separate placeholder file backs `AT-P1`. |
| AT-P2 | Aggregate safe-default, exact activation, disablement, cross-surface enforcement, truthful status, and re-enable behavior from AT-BASE-1..6. | `tests/advanced-oracle.test.js` title `AT-P2 safety remains user-controlled and truthfully reported`: One aggregate scenario invokes substantive baseline cases; no string-equality placeholder. |
| AT-P3 | Global `owns` uniqueness, authored adjacent exclusions, frozen perf/load and secret-injection boundaries, plus semantic MECE receipt. | `tests/advanced-oracle.test.js` title `AT-P3 catalogue scope ownership is MECE`: Exact scope-map tests and per-adjacent-pair `mece=pass` at current catalogue digest. |
| AT-P4 | One uniform emission path per §11.1: every `{host, axis}` in the roster is emitted through the same code path, proven by axis-local byte-landing tests, with `unsupported` the only status permitted to emit nothing. This is AT-CLAIM-1's mechanism, re-anchored after the tier's removal. | `tests/advanced-oracle.test.js` title `AT-P4 host and CI coverage is the uniform detected-host contract`: `AT-P4` runs the AT-CLAIM-1 target directly: installs across all 19 hosts and six providers, asserts every host receives its configuration through the same code path with byte sets differing only in the contract's named vendor-specific fields, and asserts no host/axis claim string (`verified`, `advertised`, `please report`) appears anywhere. No separate placeholder file backs `AT-P4`. |
| AT-P5 | `rig.json` owns leaf selection; the onboarding review starts with all four families visibly selected and persists only the explicitly confirmed/trimmed leaves. Activated policy separately owns permissions. | `tests/advanced-oracle.test.js` title `AT-P5 family default is explicit and trimmable`: accept all, trim a family, override recommendation/grade, and prove plan/apply follows the exact confirmed leaves and policy. |
| AT-P6 | Authored-service gate plus executable-first honest disposition runner (AD-15); inventory alone cannot pass. | `tests/advanced-oracle.test.js` title `AT-P6 complete services reuse the real disposition and authorship evidence`: Iterate all 115 leaves, execute each declared evidence target or valid surfaceless predicate, and prove every convention-only fallback carries a service-specific named reason. |
| AT-B1 | Enabled exact-copy control runs byte checker at enabled git/CI surfaces; approved disablement stops it and reports disabled. | `tests/advanced-oracle.test.js` title `AT-B1 exact-copy drift fails`: Drift duplicate under both scopes, then disable only that control without affecting others. |
| AT-B2 | Enabled semantic control requires current schema-validated host review over index, changes, aliases, and input digests. | `tests/advanced-oracle.test.js` title `AT-B2 semantic drift reports stale or deprecated context`: Non-identical stale context fails; missing/stale/note-only reviewer output is a gap. |
| AT-B3 | Vetted external scanner, documented full-history argv, pending activation, clean/finding/missing/error handling, exact-finding waiver, staged-control independence, and redaction of all secret-shaped evidence before writing (§9.3), which stands as the second line of defence under `AT-REPORT-1`. | `tests/advanced-oracle.test.js` title `AT-B3 first leak-scanner enable runs real repository history`: Fake vetted executables prove actual full-history invocation, all failure paths, clean activation, waiver binding, and post-remediation re-scan. Seed a known credential and assert it appears nowhere in the written report. |
| AT-B4 | Enabled pre-commit dispatcher invokes the real bounded sanitation detector over staged harness/config bytes. | `tests/advanced-oracle.test.js` title `AT-B4 pre-commit re-scans changed harness files`: Stage malicious `AGENTS.md`, spy on input hashes, and reject a note-only result. |
| AT-B5 | Exact four-verdict mapping, blocker/uncertainty precedence, freshness validation, and no verdict when disabled. | `tests/advanced-oracle.test.js` title `AT-B5 adopt-time uncertainty quarantines`: Cover all verdicts, malformed/stale review, deterministic blocker, uncertainty, and disabled path. |
| AT-B6 | Read-only typed proposal, exact user-presence approval, preimage CAS, no-op rejection, transactional exact-diff verification/rollback, and fresh re-scan. | `tests/advanced-oracle.test.js` title `AT-B6 remediation applies only the approved bounded diff and rolls back failure`: Wrong/stale/no-op, exact success, injected partial failure, unapproved extra write, observed-diff mismatch, and fresh sanitation fixtures. |
| AT-B7 | Diff development scope, repo CI scope, dependency-order fail-fast, shared runner, and actionable failed/vacuous/gap reports written locally only. | `tests/advanced-oracle.test.js` title `AT-B7 development runs diff scope and CI runs repository scope`: Prove distinct inputs, dependency-not-run, local report contents, visible gaps/vacuity, and omitted routine passes. |
| AT-HOST-1 | §11.1 emitted-axis contract covers every axis Rig emits — exact path, event schema, matcher, deny payload, proceed protocol, owned merge namespace, preservation rule, and first/repeated apply — across all 19 hosts. There is no "verified vs unverified" split in the contract's scope. | `tests/advanced-oracle.test.js` title `AT-HOST-1 every emitted axis has a complete contract`: Iterate every host and every emitted axis; validate every contract field and each byte-landing test lands the expected bytes at the expected path on a fresh target. Reject a contract missing any field on any axis. |
| AT-HOST-2 | Common evaluator denies four categories, names rule/category, passes near-matches, consumes exact one-use once, and honors activated permanent choices. | `tests/advanced-oracle.test.js` title `AT-HOST-2 evaluator denies boundaries and honors exact one-use approval once`: Cross-adapter deny/near-match plus changed/replayed/concurrent/failed-dispatch/revoked/native-expired one-use and narrow/category-wide permanent fixtures. |
| AT-HOST-5 | Shared MCP disposition governs legacy/catalogue; unsupported `pi` emits nothing; user-owned old file survives with guidance. | `tests/advanced-oracle.test.js` title `AT-HOST-5 unsupported MCP emits nothing and preserves user files`: Fresh/adopt/upgrade through both entrypoints; zero new config and byte-identical seeded user file. |
| AT-CI-1 | Exact provider adapter additively merges one Rig gate into verified existing CI under plan approval, and that gate is removable under `AT-UNINSTALL-1` from its §7.6 manifest record. | `tests/advanced-oracle.test.js` title `AT-CI-1 existing CI integration is additive and detail-free`: Seed all six provider configs and deep-compare every unrelated user value after integration; then uninstall and assert the job is gone and every unrelated value survives byte-for-byte. |
| AT-CI-2 | Absent CI creates nothing until explicit verified-provider selection and exact plan approval. | `tests/advanced-oracle.test.js` title `AT-CI-2 absent CI requires provider choice and approval`: No-choice/wrong-approval cases write nothing; each verified choice creates only its minimal native pipeline. |
| AT-CI-3 | CI runs all enabled repo controls and selected executable services that are repo-CI-applicable at their active grade, emits verdict plus counts and rule identities with no artifact upload (`AT-REPORT-1`), requests minimum permissions, uses no repo secrets, and repeats idempotently. | `tests/advanced-oracle.test.js` title `AT-CI-3 CI execution is safe idempotent and active-grade aware`: Parse/execute all six outputs; check effective binding manifest, active-grade CI applicability, permissions, no secrets, and zero second-apply diff. Assert no provider config contains an artifact-upload step for `reports/rig/` and that no job log line carries finding detail. |
| AT-CI-4 | Unknown/malformed/collision config is byte-preserved/nonzero; every integrated or bootstrapped provider is proven by its byte-landing test on a fresh repo fixture. | `tests/advanced-oracle.test.js` title `AT-CI-4 unknown CI remains byte-identical and unverified until first run`: Reject fabricated/stale/local-only receipts; validate captured byte-landing fixtures for every emitted provider integration. |
| AT-CLAIM-1 | AD-13/§6 discovers unambiguous host markers, activates exactly detected or explicit hosts, and routes all 19 hosts/six providers through one adapter contract. Absent hosts receive no tree. | `tests/advanced-oracle.test.js` title `AT-CLAIM-1 detected hosts only, whole roster reachable`: exercise every marker, mixed and bare repositories, ambiguous `AGENTS.md`, explicit absent-host opt-in, all roster entries, and exact per-axis byte landing. |
| AT-PRESENCE-1 | §8.4 three terminal states: host-native, external SSHSIG, or refusal reported unavailable. Declared-and-disclosed signer class, no downgrade ceremony (D19); Rig verifies and never signs. | `tests/advanced-oracle.test.js` title `AT-PRESENCE-1 activation refuses when no verified presence path exists`: Activate via each available path; then remove both facilities and assert refusal with reason `no_presence_facility`, prior bundle still active, and no success recorded. Assert activation is never degraded to an ordinary confirmation and never self-completes. Assert `policy status` names the declared signer class on every output for both a `sk-` and a plain entry. Assert no signing binary ships and no private key material is written. |
| AT-PRESENCE-2 | §8.4/AD-30 recovery uses only pre-registered, distinct `sk-*` SSHSIG recovery identities under `rig-policy-recovery`; registration requires an already-valid credential and recovery exhaustion is terminal for the current policy trust state. The `sk-*` class is declared and disclosed, not certified from the signature (D19); the user-verification registration ceremony is the product ceremony, while automation proves only the enforceable preconditions and disclosures around it. Authorized recovery writes a disclosed receipt before invalidating pending candidates, burning one-use approvals, or resetting evidence generations. | `tests/advanced-oracle.test.js` title `AT-PRESENCE-2 recovery is pre-registered distinct and terminal`: First signer setup offers exactly three recovery identities and later valid signer setup offers to add more. Accept a recovery signed by a pre-registered distinct recovery key and assert the receipt, replacement signer, stale pending candidate, deleted prior one-use approvals, incremented evidence generations, and disclosed status. Reject ordinary confirmation, same-key recovery, a fresh post-loss key, a recovery key under the activation namespace, a missing registration receipt, and exhausted registered credentials with reason `recovery_credentials_exhausted`; assert none of those rejected attempts changes candidate bytes, approvals, evidence generations, or signer state. Assert the registration path records a valid pre-loss registration receipt, rejects fingerprint reuse and namespace confusion, and that `policy status` discloses each recovery credential's declared class so a weak registration is visible rather than passing as hardware-backed. Do not assert a hardware touch in `node --test`; per D19 no signature artifact proves that class. |
| AT-HOME-1 | §7.4 append or namespaced additive merge only, with the install line naming any file written outside the repository; D25 makes OpenClaw an explicit flagged exception that is written only through its native CLI. | `tests/advanced-oracle.test.js` title `AT-HOME-1 OpenClaw MCP opt-in is explicit, installed, and reversible`: Use the released installer against a temporary HOME plus fake `openclaw`, `npm`, and download commands. Assert the default installation calls neither OpenClaw nor npm and leaves the global config byte-identical. Assert `--openclaw-mcp` warns before calling `openclaw mcp set`, installs and starts the target runtime, uses one `rig-<install-id>` key, and preserves an unrelated server. Reinstall is key-identical. Uninstall calls `openclaw mcp unset` and preserves the unrelated server. |
| AT-HOME-2 | §7.4 attribution by clone-local install ID from the first install, with `.rig/global-writes.json` as the removal ledger. | `tests/advanced-oracle.test.js` title `AT-HOME-2 global entries are attributed per repository`: Install from repo A and repo B into one global file; uninstall A and assert only A's entries are gone, B's and all unattributed values survive byte-for-byte, and B still works. Reinstall A twice and assert idempotence. Assert the removal report names A and not B. Assert the *first* install's entries are attributed before any second repository exists. |
| AT-DIST-1 | §12.4 root stub resolves and records a named tag, downloads before execution, installs private version `5.0.0`, all 55 unique Rig-named skills, and required MIT notice/provenance with no endorsement claim. `--openclaw-mcp` additionally ships the locked MCP runtime, but the default needs neither OpenClaw nor npm. | `tests/advanced-oracle.test.js` title `AT-DIST-1 stranger installs complete named-tag release`: run from a no-checkout git/curl/sh fixture; reject branches and remote piping; assert byte-stable repeat install, all 55 skills, both provenance files, no endorsement string, and no npm publish workflow. |
| AT-INSTALL-1 | §7.6 append-only manifest with record-before-mutate ordering, `applied` supersede carrying the post-write digest, resume from the manifest, and the `complete: false` header that suppresses every protection claim. Teardown of a partial install is the §7.6 removal path, not a second one. | `tests/advanced-oracle.test.js` title `AT-INSTALL-1 interrupted installs resume without premature claims`: Interrupt an install at each write boundary — crash, signal, permission denial, and a full-disk write failure — and assert applied writes stay, the manifest records how far it got, and the install is marked incomplete. Assert no partially applied control is reported as enabled, installed, or protecting anything, in `policy status`, the install line, and a run report. Re-run and assert resume applies only what did not land, with no duplicated work and no restart. Separately uninstall the partial install and assert it is removed by the same teardown path. |
| AT-UNINSTALL-1 | §7.6 reverse-`seq` walk over the manifest; owned files deleted, managed blocks stripped from files Rig only added to, chained hooks restored, user-global entries removed by `install_id` per §7.4; removal report names what went. | `tests/advanced-oracle.test.js` title `AT-UNINSTALL-1 uninstall removes exactly manifest-owned content`: Install across every surface at once — Rig's own files, a grafted `AGENTS.md`, a pre-commit hook, an `AT-CI-1` CI job, host configuration, and a user-global file — then uninstall and assert each is gone and every byte the user owns survives unchanged. Assert teardown order is the reverse of install by killing uninstall mid-run and asserting no hook references a removed target. Assert the report enumerates exactly what was removed. Deleting `.rig/` and declaring the repository clean must fail the case. |
| AT-UNINSTALL-2 | §7.6 clone-local content-addressed preimage store, post-removal diff, and the verified-clean versus named-best-effort split. | `tests/advanced-oracle.test.js` title `AT-UNINSTALL-2 uninstall reports verified clean or named best effort`: Uninstall a repository whose touched files carry the user's own later edits and assert **verified clean**. Edit a managed block's markers away, uninstall, and assert **best-effort** with that exact file named and the result never called clean; do the same for a file another tool rewrote. Assert no preimage is ever written back over a current file, by seeding a post-install user edit and asserting it survives. Delete the clone-local store and assert removal degrades to best-effort and says so rather than claiming clean. |
| AT-UNINSTALL-3 | §7.6 removal touches only manifest entries; `reports/rig/`, run history, `rig.json`, and `.rig/network-policy.json` are user-owned per §4.2 and are not entries. `--purge` lists before deleting. | `tests/advanced-oracle.test.js` title `AT-UNINSTALL-3 reports survive uninstall unless purge is explicit`: Accumulate reports and run history, hand-edit `.rig/network-policy.json`, uninstall, and assert all of it survives byte-for-byte. Then `--purge` and assert the complete deletion list is printed **before** anything is deleted and matches what is deleted. A purge that deletes first, or a default uninstall that removes report history, fails. |
| AT-REPORT-1 | §9.3 reports written under `reports/rig/`, excluded from version control by a managed `.gitignore` block recorded in the §7.6 manifest; no commit, no artifact upload; §11.2 emits verdict, counts, and rule identities only. | `tests/advanced-oracle.test.js` title `AT-REPORT-1 finding detail stays on the producing machine`: Run every report-writing check and assert each output path is git-ignored and uncommitted. Assert no provider config for any of the six providers contains an artifact-upload step for `reports/rig/`. Force a failing check in each provider and assert the job log carries a verdict, finding counts, and rule identities and **no** finding detail — asserted by seeding a known matched string and grepping the whole captured log for it. Assert `AT-B3` redaction still applied to the local file. |
| AT-SECRET-1 | §8.8 deterministic detection with separated disclosable and restricted records; everything handed to the agent is built from the disclosable record. The channel is the single default-closed `secrets.model_assisted_triage` field (§8.2): while false, no code path assembles matched content into agent context; while true, the pipeline attaches a bounded redacted `matched_content` field to the agent-visible triage view and drops it on deactivation (fresh epoch). Enabling is an activated policy change disclosed at the point of enabling. | `tests/advanced-oracle.test.js` title `AT-SECRET-1 matched secret content stays out of model context by default`: Seed known credentials, run under default configuration, and assert the agent-visible surface carries counts, rule identities, and locations and never the matched bytes — grep every string crossing that boundary for the seeded value. Assert detection is deterministic across repeated runs. Enable `secrets.model_assisted_triage` through the normal activation path and assert the `matched_content` field appears only then and only in the triage view, that the enabling point states the third-party reason, and that deactivation drops it and starts a fresh epoch. A default that admits content fails even when disclosed. |
| AT-LF-1 | §5.8 whole-repository, open-ecosystem component discovery derived from the repository (no fixed roster); every discovered component appears in the reviewable plan with its derived ecosystem. | `tests/advanced-oracle.test.js` title `AT-LF-1 lint-format discovery is whole-repository and open-ecosystem`: a `POLY` fixture (JS + nested non-JS component) yields both components with repository-derived ecosystems in the plan; a run that finds only the root, or matches a hard-coded language list, fails. |
| AT-LF-2 | §5.8 hybrid-plus (GA-16/17): existing toolchains preserved by default; supported setup or a better alternative is an opt-in plan line the user must select. | `tests/advanced-oracle.test.js` title `AT-LF-2 existing tools are preserved and alternatives require user choice`: a `SPINE` fixture's eslint/prettier config is byte-identical after `recommend`; assert a silent replacement or forced migration fails. |
| AT-LF-3 | §5.8 semantic command binding by role from manifests/tool-config/declared tasks; ambiguity becomes a `needs_user_choice` state that blocks apply for that component. | `tests/advanced-oracle.test.js` title `AT-LF-3 command discovery is semantic and ambiguity returns to the user`: bind a non-standard-named declared task; assert an ambiguous case halts for user choice; reliance on fixed script names or a silent guess fails. |
| AT-LF-4 | §5.8/§6.5 the user deselects components and requests a non-default scope; the applied plan matches the user's choice, not the recommendation (`AT-P5`). | `tests/advanced-oracle.test.js` title `AT-LF-4 user component and scope choices override recommendations`: deselected components are absent and the requested scope is honored; a plan that reasserts the recommendation over the user's edit fails. |
| AT-LF-5 | §9.4 plan-bound consent: selection runs nothing; only an exact-digest-approved plan authorizes its listed read-only commands/dirs/components; the untrusted-code boundary is disclosed and `shell: false` is not a safety claim. | `tests/advanced-oracle.test.js` title `AT-LF-5 selection authorizes no repository command`: assert zero execution before approval, only listed commands after, the disclosure present; any pre-approval execution, unlisted command, or `shell: false` safety claim fails. |
| AT-LF-6 | §5.8/§7.6 apply journals every write at the time it is made; an uncoverable component is excluded only with user approval and reported as a visible unprotected gap; covered components install. | `tests/advanced-oracle.test.js` title `AT-LF-6 partial coverage requires exact exclusion approval and journals writes`: `advanced-lint-format-lifecycle.test.js` with `advanced-apply.test.js`: manifest records each write; excluded component named unprotected; an unrecorded write, or an exclusion without approval, fails. |
| AT-LF-7 | §5.7 Policy level (`minimal`), when it is the selected grade, governs the change and reports a real Policy-level result. | `tests/advanced-oracle.test.js` title `AT-LF-7 Policy grade produces a real changed-file verdict`: a real Policy verdict on the changed files; a placeholder or a silent higher-level run fails. |
| AT-LF-8 | §5.7 Context (`mid`) is a strict cumulative superset of Policy — governance plus understanding the change (AD-4/AT-SHAPE-3 composition); a clean Policy pass never short-circuits the understanding pass. | `tests/advanced-oracle.test.js` title `AT-LF-8 Context is a cumulative superset and runs after clean Policy`: every Policy check still runs plus Context's understanding pass even when Policy passes cleanly; a Context grade that drops, swaps, or short-circuits after a clean Policy pass fails. |
| AT-LF-9 | §5.7 Evidence (`maximal`) is a strict superset of Context and rests the verdict on verifiable evidence (re-runnable output/exit/reports bound to input digests), plus the §11.3 CI gate; a clean Context pass never short-circuits the evidence work. | `tests/advanced-oracle.test.js` title `AT-LF-9 Evidence is cumulative and verifiable without requiring a CI graft`: every Context check still runs plus a verifiable Evidence result even when Context passes cleanly; an Evidence pass backed only by an unverifiable agent assertion, or one that short-circuits after a clean Context pass, fails. |
| AT-LF-10 | §9.4 diff-scoped by default in the component's working directory honoring its ignore rules; never silently widened. | `tests/advanced-oracle.test.js` title `AT-LF-10 checks default to diff scope and honor component ignores and cwd`: clean/ignored files untouched under default scope, only changed files inspected; a whole-repo default, ignored ignore rules, or wrong directory fails. |
| AT-LF-11 | §9.4 read-only guarantee: pre/post content-digest check; on mutation, stop before the next command, fail, report exact paths with before/after evidence, no auto-restore, no continuation. | `tests/advanced-oracle.test.js` title `AT-LF-11 a read-only check that mutates halts with preserved evidence`: a check whose tool writes the tree is detected, halted, evidenced, tree left as-is; an auto-restore, continuation, or pass fails. |
| AT-LF-12 | §9.4 autofix is a separately approved mutating action, re-verified by re-running the read-only check, left as uncommitted user-owned edits; never in the check, never auto-committed. | `tests/advanced-oracle.test.js` title `AT-LF-12 autofix is separately approved and rechecked without committing`: no mutation from the check; fixes only under separate approval; a re-run verification; autofix folded into the check, auto-committed, or unapproved fails. |
| AT-LF-13 | §11.3/§11.2/§8.9/AD-23 Evidence-level CI is additive to `verified_existing`, proposed-and-separately-approved for `absent`/`unsupported`, preserving for `unknown`; never auto-created on grade selection alone; CI applicability is grade-aware, so a Policy/Context-grade leaf stays out of a pre-existing Rig CI job; verdict/counts/rule-identities only. | `tests/advanced-oracle.test.js` title `AT-LF-13 Evidence CI is additive separately approved and grade-aware`: three CI variants produce their stated behavior; a silent edit of an unknown pipeline, an auto-created CI on selection, a Policy- or Context-grade leaf running in a pre-existing Rig CI job, or a clobbered unrelated job fails. |
| AT-LF-14 | §9.4 command drift: an approved binding carries its command/target digest; a drifted task halts before running, discloses the drift, and requires a freshly approved plan. | `tests/advanced-oracle.test.js` title `AT-LF-14 command drift stops before execution and requires a new plan`: the changed command never runs under the old approval and the drift is disclosed; running the changed task or the stale approved text fails. |
| AT-LF-15 | §9.4/§9.3/§8.8 report stays local under `reports/rig/`, keeps failure/vacuous/gap and omits routine passes, redacts secrets/PII/host-rooted data on the producing host, is actionable; CI emits verdict/counts/rule-identities only; matched secret content only under the `secrets.model_assisted_triage` opt-in. | `tests/advanced-oracle.test.js` title `AT-LF-15 reports are local redacted actionable and failure-centric`: no report/artifact leaves the host, CI carries only verdict/counts/rule-identities, a seeded secret is absent from agent context by default, findings actionable; any leaked detail, uploaded artifact, or default secret exposure fails. |
| AT-LF-16 | §9.4 each abnormal ending — `timeout`, `cancelled`, `missing_dependency`, `signalled`, `partial_output`, `command_not_found` — is its own distinct reported non-passing (blocking) state. | `tests/advanced-oracle.test.js` title `AT-LF-16 every abnormal ending is distinct and non-passing`: all six induced endings produce six distinct named non-passing results; collapsing any into `pass`, a generic `failed`, or non-blocking fails. |
| AT-LF-17 | §7.6/§11.3 reinstall is the idempotent resume that claims no protection until complete and produces no duplicates. | `tests/advanced-oracle.test.js` title `AT-LF-17 reinstall is an idempotent resume with no premature support claim`: a resumed install with no duplicates and no premature protection claim; a from-scratch rewrite, a duplicate, or a mid-install "protected" claim fails. |
| AT-LF-18 | §7.6/§11.3 removal reverses exactly the manifest-recorded generated CI/config/managed blocks and nothing else; user autofix edits are ordinary working-tree changes, not manifest entries, and survive. | `tests/advanced-oracle.test.js` title `AT-LF-18 removal reverses manifest artifacts and preserves source fixes`: manifest-recorded artifacts removed, the user's autofix edits and any artifact Rig cannot prove it created untouched; reverting user fixes or deleting an unrecorded artifact fails. |
| AT-LF-19 | §5.8 per-component evidence-backed support claim (≥ Policy built, commands bound, real result under plan-bound consent); whole-repository claim is the AND over discovered non-excluded components and is suppressed by any exclusion. | `tests/advanced-oracle.test.js` title `AT-LF-19 support is evidence-backed per component and honest in aggregate`: on `POLY`, the covered component is supported on real evidence, the excluded one is not, and the whole-repository claim is withheld; claiming whole-repository support from install success or per-run results without a built level fails. |
| AT-LF-20 | §9.4 a plan approval authorizes exactly one execution of its exact plan digest; re-presenting a consumed approval for a second execution is refused, not re-authorized. | `tests/advanced-oracle.test.js` title `AT-LF-20 a plan approval authorizes exactly one execution`: a first execution against a fresh approval succeeds; a second execution presenting the same already-consumed approval is refused; accepting the reused approval fails. |
| AT-LF-21 | §9.4 a task's working directory and every path it touches resolve inside the repository even through a symlink; it receives no ambient environment variable beyond an explicit allowlist. | `tests/advanced-oracle.test.js` title `AT-LF-21 task filesystem and environment stay isolated`: a command whose cwd is an in-repo symlink resolving outside the repository is refused; a command run inside the repository does not see a parent-process environment variable absent from the allowlist; either leak fails. |
| AT-LF-22 | §9.4 a task not explicitly granted network access by the plan has no outbound network reachability; a task explicitly granted it may connect. | `tests/advanced-oracle.test.js` title `AT-LF-22 a task has no network reachability without an explicit grant`: a command with no network grant fails to reach a local listener; a command with an explicit grant reaches it; a default-allowed connection without a grant fails. |
| AT-LF-23 | §9.4 a task exceeding a configured memory ceiling or wall-clock timeout is killed and reported as its own distinct non-passing state (`GA-33`), never a hang or silent truncation. | `tests/advanced-oracle.test.js` title `AT-LF-23 a task exceeding its resource or time cap is killed and reported`: a command exceeding a configured timeout is terminated and reported with a named timeout state rather than left running or reported as a generic failure. |
| AT-LF-24 | §9.4 a repository-supplied symlink whose real target resolves outside the repository is refused for read, write, or working-directory use, never followed because its lexical path looks contained. | `tests/advanced-oracle.test.js` title `AT-LF-24 a repository symlink escaping the repository is refused`: a command targeting a path reached only through an escaping symlink is refused and reported as a boundary violation rather than executed against the real outside path. |
| AT-PB-1 | [Path B F-1](../reasoning/2026-08-31-path-b-technical-spec.md#3-f-1--skill-shelf-family-reorganisation) defines the eleven-family 63-skill membership, bounded metadata, recursive source layout, explicit aliases, unique canonical names, flat native projections, and the untouched governed-service boundary. | `tests/path-b-catalog.test.js` title `AT-PB-1 capability families index all 63 skills with exact membership`: snapshot the full membership and names; sibling `AT-PB-1` tests exercise recursive metadata, invalid aliases/metadata, collision handling, and the byte-frozen 115-service tree. |
| AT-PB-2 | [Path B F-2](../reasoning/2026-08-31-path-b-technical-spec.md#4-f-2--graft-section-marker-convention) defines the exact version-1 grammar, ownership classes, CAS/preimage rule, whole-current-section journal record, and section-only update/removal. | `tests/path-b-graft.test.js` title `AT-PB-2 create update and reapply own only a versioned graft section`: exercise create/no-op/update; sibling `AT-PB-2` tests cover one-of-many removal, CRLF/no-final-newline identity, malformed/stale/unsupported/link refusal, full-section journalling, and uninstall preservation. |
| AT-PB-3 | [Path B F-3](../reasoning/2026-08-31-path-b-technical-spec.md#5-f-3--capability-catalog-context-surface) defines the deterministic installed catalogue, release-pinned non-discoverable source shelf, compact context, drift invalidation, and no-network refresh policy. | `tests/path-b-catalog.test.js` title `AT-PB-3 generated catalogue bytes are deterministic and content-addressed`: independently check ordering and the content digest; sibling `AT-PB-3` tests install the shelf once, keep optional skills out of discovery, require eight core/onboarding projections, prove offline prepare, reject stale catalogue proposals, and preserve a conflicting user-edited installed catalogue. |
| AT-PB-4 | [Path B F-4](../reasoning/2026-08-31-path-b-technical-spec.md#6-f-4--rig-onboarding-state) defines the five repository-local artifacts, strict state/proposal schemas, eight summary headings, CAS revisions, transitions, invalidation, resume, and derived Markdown. | `tests/path-b-state.test.js` title `AT-PB-4 prepare creates the complete machine state and deterministic reports under .rig`: assert initial schema and idempotent bytes; sibling `AT-PB-4` tests cover canonical summary/proposal binding, rejected partial writes, stale revisions/consent, and disk/state/report reconciliation. |
| AT-PB-5 | [Path B F-5](../reasoning/2026-08-31-path-b-technical-spec.md#7-f-5--rig-onboarding-skill-and-rig-mcp-tool) defines the semantic playbook and critical predicate plus one `handleOnboarding` prepare/propose/apply/check union used by CLI and MCP, with exact-summary approval and no self-approval. | `tests/path-b-onboarding.test.js` title `AT-PB-5 prepare supplies bounded context without making semantic choices or repo writes`: prove mechanical preparation; sibling tests cover proposal immutability, unresolved decisions, summary-bound consent, selective marked apply, resume/idempotency, JSON CLI parity, MCP schema/annotations/parity, explicit invocation, and terminal truthfulness. |
| AT-PB-6 | [Path B F-6](../reasoning/2026-08-31-path-b-technical-spec.md#8-f-6--one-installation-command) defines `install rig`, repeatable registry host mapping, always-on runtime delivery, explicit onboarding handoff, subordinate legacy paths, and no auto-trigger. | `tests/path-b-install.test.js` title `AT-PB-6 public grammar is install rig with repeatable host and no tiers`: assert the public surface; sibling `AT-PB-6` archive-install tests cover omitted/one/many host mapping, order/de-duplication, unknown-host pre-write refusal, runtime/catalog presence, preserved repo bytes, absent onboarding state, and exact next-step output. |
| AT-PB-7 | [Path B S-1](../reasoning/2026-08-31-path-b-technical-spec.md#9-s-1--config-inventory-writer) defines bounded known-root enumeration, structural-only extraction, declared tags, stable digest/report rendering, redaction/warnings, and realpath uniqueness. | `tests/path-b-inventory.test.js` title `AT-PB-7 inventory covers every known harness root with stable structural rows`: exercise every kind/host and deterministic digest; sibling `AT-PB-7` tests prove no body/secret leakage, bounded warning taxonomy, contained-symlink handling, escaping/alias refusal, and repeated Markdown identity. |
| AT-PB-8 | [Path B S-2](../reasoning/2026-08-31-path-b-technical-spec.md#10-s-2--overlap-surface-writer) defines exact tag/capability/alias intersection, deterministic grouping/set difference, and the no-selection/no-mutation boundary. | `tests/path-b-inventory.test.js` title `AT-PB-8 overlap uses only exact declared tags and explicit aliases`: a pinned catalogue fixture distinguishes declared matches from unknown-prefix/prose non-matches and groups sibling skills; the companion `AT-PB-8` prepare test proves deterministic hint wording with empty proposal/applied state and byte-identical repo files. |
| AT-PB-9 | [Path B S-3](../reasoning/2026-08-31-path-b-technical-spec.md#11-s-3--single-canonical-entrypoint) makes `.rig/routing.md` the sole mandate and the canonical onboarding skill the sole playbook; every native/MCP adapter must resolve to them without copying doctrine. | `tests/path-b-mcp.test.js` title `AT-PB-9 every installed adapter resolves to one router and one onboarding playbook`: install multiple hosts, reject duplicated mandate/playbook phrases and dangling pointers; the companion `AT-PB-9` test compares domain and installed-MCP playbook bytes. |
| AT-PB-10 | [Path B S-4](../reasoning/2026-08-31-path-b-technical-spec.md#12-s-4--weight-budget-and-correctness-check) defines attributable weight, warning-only growth, the nine-code hard-failure set, and legitimate staging/multi-host exceptions. | `tests/path-b-weight.test.js` title `AT-PB-10 file and byte growth warn but never block a checked result`: prove both warning codes with successful domain/CLI status; nine sibling `AT-PB-10` corruption tests independently require each hard code and non-success, and the final sibling rejects false duplicate findings for staged source plus approved host projections. |
| AT-HD-1 | [Hardening F1](onboarding-hardening-spec.md#f1-at-hd-1--proposal-body-integrity) derives the canonical proposal-body digest before any proposal field is consumed. | `tests/onboarding-hardening.test.js` title `AT-HD-1 apply rejects a proposal whose body has been tampered post-signing`: mutate body bytes while preserving the stored witness and require pre-mutation refusal. |
| AT-HD-2 | [Hardening F2](onboarding-hardening-spec.md#f2-at-hd-2--exclusive-temporary-file-creation) binds the predictable temporary path to an exclusive open. | `tests/onboarding-hardening.test.js` title `AT-HD-2 atomicWrite refuses to write through a .tmp symlink before any byte reaches the outside target, and recovers once the operator clears it`: seed an outside sentinel and prove no byte crosses the link; then clear the symlink and prove recovery succeeds. |
| AT-HD-3 | [Hardening F3](onboarding-hardening-spec.md#f3-at-hd-3--commit-time-inventory-recheck) re-derives inventory immediately before mutation. | `tests/onboarding-hardening.test.js` title `AT-HD-3 apply detects a file added to the repository after proposal was signed`: add a file after approval and require stale-inventory refusal. |
| AT-HD-4 | [Hardening F4](onboarding-hardening-spec.md#f4-at-hd-4--per-host-scope-enumeration) passes exact installed hosts through a per-host native-or-fallback decision. | `tests/onboarding-hardening.test.js` title `AT-HD-4 apply projects selected skills into both native and instruction-only scopes with scope-correct names`: install a native and a non-native host and require skill names to match each host's discovery scope. |
| AT-HD-5 | [Hardening F5](onboarding-hardening-spec.md#f5-at-hd-5--one-source-of-truth-for-the-release-version) makes the package manifest the release-version authority. | `tests/onboarding-hardening.test.js` title `AT-HD-5 README version examples match package.json in every language edition; skill-catalog has no independent hardcoded default`: reject drift or a library default across all README language editions. |
| AT-HD-6 | [Hardening F6](onboarding-hardening-spec.md#f6-at-hd-6--fail-closed-inventory-verification) makes inventory verification exceptions visible. | `tests/onboarding-hardening.test.js` title `AT-HD-6 inventory drift check propagates harness errors rather than returning empty`: force traversal failure and reject an empty result. |
| AT-HD-7 | [Hardening F7](onboarding-hardening-spec.md#f7-at-hd-7--compact-mcp-text-channel) separates human text from structured MCP output. | `tests/onboarding-hardening.test.js` title `AT-HD-7 MCP text output is a concise human summary, not a JSON copy of structuredContent`: call both shipped adapters and inspect their real responses. |
| AT-HD-8 | [Hardening F8](onboarding-hardening-spec.md#f8-at-hd-8--reasoning-trace-immutability-reconciliation) gives both policy surfaces one body/frontmatter rule. | `tests/onboarding-hardening.test.js` title `AT-HD-8 reasoning/README.md and wiki-maintenance/SKILL.md consistently define body-immutable, frontmatter-mutable traces`: require agreement and cross-citation. |
| AT-HD-9 | [Prevention Theme A](onboarding-hardening-invariants.md#contract) ratchets derived-on-read, exclusive-create, and fail-closed verification shapes. | `tests/onboarding-invariants.test.js` title `AT-HD-9 I-A-2 onboarding-state.atomicWrite opens the temp with O_EXCL, never bare writeFileSync`: sibling `AT-HD-9` tests cover proposal re-derivation and every verification catch. |
| AT-HD-10 | [Prevention Theme B](onboarding-hardening-invariants.md#contract) ratchets commit-time and per-host observations. | `tests/onboarding-invariants.test.js` title `AT-HD-10 I-B-2 a native host does not suppress another installed host's own discovery scope`: require both hosts' skill-scope outputs with the native one neither overriding nor hiding the other's entries. |
| AT-HD-11 | [Prevention Theme C](onboarding-hardening-invariants.md#contract) ratchets single authorities, parity, and policy cross-links. | `tests/onboarding-invariants.test.js` title `AT-HD-11 I-C-1 buildSkillCatalog has no hardcoded releaseTag default`: sibling tests scan runtime version literals, MCP source parity, and both trace-policy documents. |
| AT-HD-12 | [Prevention Theme D](onboarding-hardening-invariants.md#contract) ratchets adversarial reachability and finding/test completeness. | `tests/onboarding-invariants.test.js` title `AT-HD-12 I-D-1 MCP handlers do not JSON-stringify structuredContent into the text channel`: sibling tests require real-adapter execution and exact finding/test coverage. |

The first-running oracle verifier:

0. **first**, computes both Gate 1 digests and the digest of
   `testing-infrastructure.manifest`, rebuilds the exact
   `rig-oracle-freeze-v2` message, and verifies `gate1.sig` in namespace
   `rig-gate1` against `gate1.allowed-signers`;
1. when armed, fails on a missing/malformed/non-verifying signature and names
   the matched principal and SHA-256 key fingerprint on success; when unarmed,
   prints `Gate 1 unprotected` and continues without claiming protection;
2. parses the stable sorted manifest, rejects escaping/duplicate/missing
   paths, and verifies every listed SHA-256 before loading any product test;
3. confirms one present technical specification is named as the current
   approach, without requiring a frozen status or signing its bytes;
4. compares the 95 current Gate-1 IDs, trace rows, and substantive executable
   test titles for exact equality, and stats every named target;
5. runs before all code tests and short-circuits them on any integrity or
   coverage-mapping failure.

Catalogue filler, missing product behavior, and review verdicts are checked by
the manifested acceptance tests and release evidence, not by weakening the
unarmed oracle verifier into a pre-implementation green claim.
It does **not** consult git for any of this. There is no upstream
comparison, no branch-protection requirement, and no notion of a "reviewed
commit" anywhere in the gate (GA-11).

## 14. Ordered Tracer-Bullet Slices

The 95-case oracle-preparation slice runs before production implementation.
Existing modules and tests are reusable spine, not reusable evidence: stale
meanings are replaced. Pre-signature product tests are expected to be red for
behavior that does not exist. After the owner signs the manifest, every
implementation slice clears named failures without changing oracle bytes;
`npm run test:code` remains the faster code-only signal.

D24 makes all 115 Policy leaves release-blocking and suspends one-at-a-time
authorship for this MVP. Lint-format's additional Context/Evidence mechanisms
still thread through the generic runner, CI, and lifecycle slices. The 55
vendored skills, distribution path, and detected-host onboarding land early so
the first post-signature tracer produces an installable artifact.

### Slice 1 - Specification authority and complete executable oracle

Implement the §13 oracle verifier first, pin the Gate-1 digests, transcribe all
**95** IDs into substantive tests, and remove or rewrite obsolete tests that
assert a non-disableable baseline, withdrawn tiers, or tautological aliases.
Write the stable sorted testing-infrastructure manifest, add
`npm run test:code`, and wire the verifier ahead of code tests in `npm test`.
The verifier accepts the unarmed preparation state only with the exact
`Gate 1 unprotected` report; once armed it fails closed.

This slice ends at the one manual step: the intent owner reviews the inferred
55-skill inventory correction and all test bytes, records the signer identity
and attested key class, and signs the exact v2 oracle message. Production slices
do not start until it verifies.

Verification:

```sh
node scripts/check-advanced-spec.js
node --test tests/advanced-spec-gate.test.js tests/advanced-acceptance.test.js
```

### Slice 2 - Catalogue disposition and authored-content gate

Add explicit executable/convention/surfaceless metadata, real evidence targets,
anti-filler/duplicate checks, exact inventory counts, Policy/untailored
declarations, and the exact-digest all-leaf semantic review schema. All 115
unauthored leaves remain failing product targets until Slice 14; no D23
exception or expected-debt green path remains.

Verification:

```sh
node --test tests/advanced-catalogue.test.js tests/advanced-services.test.js
```

### Slice 3 - Policy parsing, active bundle, and truthful status

Implement strict bounded policy parsing, exact-byte digest, shipped safe
default, candidate/active separation, committed trust/active bundle
validation, independent effective switches, evidence generations, and
status. Remove `rig.json` baseline rejection without accepting policy keys
there.

Verification:

```sh
node --test tests/advanced-policy.test.js tests/advanced-config.test.js
```

### Slice 4 - User-presence and one-use approval lifecycle

Implement verified host-native-first/external-signature fallback, common
receipts, signer setup/rotation, pre-registered recovery, clone/worktree-local
approval storage, full action normalization, exclusive consumption,
list/revoke, and native expiry handling. Repository/TTY self-authorization
remains impossible.

Verification:

```sh
node --test tests/advanced-policy.test.js tests/advanced-enforcement.test.js
```

### Slice 5 - Cross-surface evaluator and policy-aware onboarding

Implement one pure evaluator and representative shell/web/MCP adapter
fixtures, denial/proceed payloads, permanent narrow/category choices,
preferred MCP rerouting as a separately evaluated action, safe-default
sanitation order, approved sanitation disablement, and truthful gaps.

Verification:

```sh
node --test tests/advanced-enforcement.test.js tests/advanced-policy.test.js tests/advanced-recommend.test.js
```

### Slice 6 - Real sanitation remediation and policy-aware transaction

Extend the existing plan/apply spine with exact plan approval,
policy/adapters, control wiring/unwiring, real read-only remediation
proposals, preimage CAS, no-op rejection, observed-diff equality,
rollback, and fresh sanitation.

This slice also lands the §7.6 **manifest writer**, because every later
slice writes through this spine and a mutation that predates the writer
is a mutation nothing can remove. Deliver the append-only journal, the
write-record-then-mutate ordering, the `applied` supersede with post-write
digest, the clone-local preimage store, and the `complete: false` header
that suppresses every "protecting" claim while an install is in flight.

Verification:

```sh
node --test tests/advanced-plan.test.js tests/advanced-apply.test.js tests/advanced-graft.test.js tests/advanced-remediation.test.js tests/advanced-install-manifest.test.js
```

### Slice 7 - Policy-aware git/CI controls and evidence epochs

Run changed-harness sanitation, exact-copy, deterministic secrets,
selected Product-Security checks, and the preserved user hook in the
specified order, only when their leaf/surface is enabled. Re-enable
requires fresh evidence.

Verification:

```sh
node --test tests/advanced-baseline.test.js tests/advanced-sync.test.js tests/advanced-secret.test.js tests/advanced-verdict.test.js
```

### Slice 8 - Honest service runner and real history activation

Use one selected-service-driven runner for source/target CI; reject
missing/malformed/no-op bindings; verify convention state; permit vacuity
only for declared surfaceless predicates. Require a vetted external
scanner and real full-history first-enable result or exact-finding waiver.

Verification:

```sh
node --test tests/advanced-runs.test.js tests/advanced-reports.test.js tests/advanced-secret.test.js
```

### Slice 9 - One-uniform-path host adapters and byte-landing tests

Implement §11.1 for the **whole** 19-host roster on one code path. For
every `{host, axis}` pair, author the complete contract and a byte-landing
test that asserts the correct bytes land at the correct path on a fresh
target. Add bounded, unambiguous repo-relative marker paths per host and prove
automatic onboarding emits exactly the detected set; shared `AGENTS.md` alone
selects no specific host, a bare repo creates no host tree, and explicit opt-in
is the only absent-host override. `unsupported` selected axes emit nothing and
cite the vendor absence. No host/axis claim label
(`verified` or `advertised`) appears in install output, run reports, or
per-host registry projections; that surface-scoped assertion is a test
assertion. Control/policy evidence status, where `verified` means a leaf holds
fresh current-epoch evidence, is a separate surface and is exempt.

The registry header records once — in prose, in one place — that Rig has
not observed enforcement fire on any host. That sentence appears nowhere
else in the product, and a grep for it in install output or run reports
must find nothing.

Retire unsupported `pi` MCP from legacy and catalogue paths without
deleting user-owned files.

Author §7.7's `.rig/install-docs.md` generator alongside the adapters: one
labeled, copy-pasteable section per host, naming exactly what was emitted
and any manual completion step verbatim, or citing the vendor absence for a
wholly `unsupported` host.

Verification:

```sh
node --test tests/advanced-hosts.test.js tests/advanced-host-detection.test.js \
  tests/advanced-enforcement.test.js tests/basic-renderers.test.js tests/advanced-install-docs.test.js
```

### Slice 10 - One-uniform-path CI adapters and bootstrap

Author exact provider contracts and byte-landing tests for all six
providers, additive existing-config adapters, collision refusal, explicit
absent-CI provider selection and plan approval, least-privilege/no-secret
pipelines, and idempotence.

**Findings never leave the runner (`AT-REPORT-1`).** Every emitted
pipeline prints a verdict, finding counts, and rule identities, and
nothing more. No provider adapter uploads `reports/rig/`, and none echoes
finding detail into the job log.

Every provider ships on the same test path: its byte-landing test asserts
the correct bytes land in the correct paths on a fresh repo fixture. No
provider is `verified` and no provider is `unverified`; each is either
`emitted` with a passing byte-landing test, `unsupported` for a documented
vendor absence, or a release blocker.

Verification:

```sh
node --test tests/advanced-ci-floor.test.js tests/advanced-apply.test.js \
  tests/advanced-report-disclosure.test.js
```

### Slice 11 - User-global writes, attribution, and install-line disclosure

Implement §7.4 append and namespaced additive merge for user-global
surfaces, the clone-local install ID, per-entry attribution from the
first install, the `.rig/global-writes.json` ledger, and the
uninstall/reinstall semantics. Add the `AT-HOME-1` install line that
names any file written outside the repository. **Do not add any per-host
claim string** to install output or run reports — every host is on the
same non-interactive surface, and the only per-run channel that names a
host is the out-of-repo file line.

Verification:

```sh
node --test tests/advanced-global-writes.test.js tests/advanced-claims.test.js
```

### Slice 12 - Install resume and complete removal

Every surface Rig writes now exists, so this is the first point at which
removal can be proved against the whole of it. Implement §7.6 resume —
verify each `applied` record against its digest and skip it, re-check each
`pending` record against the file and apply only what did not land — and
the reverse-`seq` teardown that removes Rig's own files, strips managed
blocks from files Rig only added to, restores chained hooks, and drops
user-global entries by `install_id`. Implement the post-removal diff
against the preimage store that reports **verified clean** or names each
best-effort file, and `uninstall --purge`, which lists usage artifacts
before deleting them and leaves them alone otherwise.

The load-bearing tests are the destructive ones. Interrupt an install at
each write boundary and assert the writes already applied stay, the
manifest records how far it got, and nothing reports itself as protecting
anything; then re-run and assert no duplicated work; then instead
uninstall the partial install and assert the same teardown path removes
it.

Verification:

```sh
node --test tests/advanced-install-resume.test.js tests/advanced-uninstall.test.js
```

### Slice 13 - Distribution and vendored skills

Author the committed root `install.sh`, delete the inherited npm publish
workflow, move `package.json` to `5.0.0`, and prove a stranger with only git,
curl and sh can install into an empty repository from a released tag. Wire all
55 vendored skills through the selected-host materializer and include their MIT
notice/provenance in every installed copy.

Verification:

```sh
node --test tests/advanced-distribution.test.js
```

### Slice 14 - Author all 115 service packs

Replace every TODO/generic/repeated fragment with service-specific
identity, scope/exclusions, applicability, dependencies, cumulative
grades, honest disposition, checks, and acceptance evidence. Reuse
existing Rig skills where identity matches, without copying filler. Run
the independent exact-digest 115-leaf semantic/MECE review.

**D24 suspends sequential authorship for this release.** Author in family
batches at agent discretion, but every fragment states Policy and untailored
baseline status, every missing binding is a named coverage gap, and no generated
generic success binding is permitted. Post-beta Context/Evidence promotion
returns to ordinary one-leaf review.

Verification:

```sh
node --test tests/advanced-catalogue.test.js tests/advanced-services.test.js
node scripts/check-advanced-spec.js
```

### Slice 15 - Complete matrix, fresh specification review, and regression

Run every frozen acceptance case over representative repo/host fixtures,
all §11 contracts and byte-landing tests across the whole 19-host roster
and six-provider roster, malicious/disabled/re-enabled policy paths,
concurrency/replay cases, UI-less override, dependencies, remediation
rollback, scanner failures, and failing/vacuous/gapped services. Run the
report-only fresh technical-spec and all-leaf catalogue review against the
final exact digests. It is release evidence, never a freeze or retroactive
authorization. Any design defect found here updates this working specification;
any oracle defect is proposed to the key holder and requires re-signing before
implementation continues.

Verification:

```sh
node scripts/check-advanced-spec.js
node --test tests/advanced-*.test.js
npm run test:rig
npm test
```

## 15. Risks and Explicit Limits

- **Gate 1's trust root lives inside what it protects.**
  `gate1.allowed-signers` is the whole of the verifier's trust, and a
  context that can write the repository can replace it and re-sign. Header
  §1 states the ceiling and the two mitigations — the gate naming the
  signer fingerprint on every run, and the `namespaces="rig-gate1"`
  restriction — and Gate 1 §9 accepts the residual under D17 and D19.
- **Enforcement is documented, not observed (host-tier amendment).** Rig
  ships one configuration for all 19 hosts and its byte-landing tests
  prove the correct bytes land in the correct paths, not that a deny
  actually fires on any host. The honest statement of this lives in the
  host registry header, not in user-facing output; a user who wants it
  reads it there. A design that projects a per-host claim about this into
  install output or run reports draws the withdrawn tier by another name.
- **Semantic sanitation and drift judgment inherit the host model's
  limits.** The static floor, bounded evidence, fail-closed verdict, and
  human approval are Tier 2 defenses. Sandboxing, egress control, DLP,
  immutable telemetry, and an independent semantic runtime remain Tier 3.
- **Lint-format's Context and Evidence levels ride the host model.** Policy
  rests on the component's own deterministic commodity checks and is as sound
  as they are; the understanding pass (Context) and the evidence judgment
  (Evidence) are host-agent work, so `AT-LF-9`'s "verifiable evidence, not an
  agent opinion" is enforced by requiring re-runnable command output and
  captured reports bound to input digests, not by trusting the agent's
  narration. An Evidence verdict is only as trustworthy as the evidence it
  cites, which is why an unverifiable assertion fails the case.
- **Git hooks are per clone.** The committed dispatcher is team-shareable,
  but each clone/worktree must run materialization to install its resolved
  pre-commit hook and owns separate one-use approval state. CI is the
  share-time backstop.
- **Tier 2 cannot mediate unexposed or nested OS network behavior.**
  Adapters mechanically cover only the documented shell/web/MCP events an
  axis exposes. An allowed process may perform hidden egress and an
  unrestricted same-user OS adversary may bypass repo files. Status
  reports each gap.
- **User-presence assurance depends on the host/OS provider.** A repository
  signature verifier can prove a receipt, not biometric/hardware
  integrity. Provider contracts and byte-landing tests are release
  evidence, not assumed trust.
- **No Rig timer means unchanged consent may remain pending.** Full
  context binding, visible age, explicit revoke/revoke-all, native
  expiry, and atomic consumption prevent widening/replay; elapsed time
  alone does not invalidate the user's exact choice.
- **Unknown CI formats cannot be safely rewritten generically.** The
  check command may be materialized dormant, but unknown/malformed/
  colliding config remains byte-identical and produces a visible nonzero
  integration gap.
- **Vetted history scanning introduces a user-managed prerequisite.** Rig
  does not auto-install a scanner or claim that its staged regex floor is
  a history scanner. Missing/unsupported tooling keeps the selected
  service pending.
- **MECE has a semantic component.** Unique scope keys and spot checks
  prevent mechanical duplication; an independent catalogue review must
  still compare prose boundaries before release.
- **The whole catalogue is an authoring-volume risk.** It does not justify
  a template engine or generated filler. Every fragment must name concrete
  checks and pass the shared service-shape contract.
- **On the external-signer path, "no presence, no activation" holds by the
  user's key hygiene, not by anything Rig verifies (D19).** If the allowed
  signer is an ordinary key on disk, an agent that can read it produces a
  valid activation signature with no human present, and Rig cannot tell.
  Every `policy status` names the declared signer class so the user is
  never left assuming otherwise.
- **A user-global write has global blast radius.** Installing in one
  repository changes behavior in every project that host opens.
  Disclosed in the install line, not through a separate prompt.
- **Clone-local identity orphans entries on repository deletion.**
  Deleting a repository without uninstalling leaves its user-global
  entries with nothing that knows their identifier. Status names them;
  Rig does not reap them.
- **Gate 1 integrity depends on a key the intent owner holds.** If it is
  lost or never obtained, nothing protects Gate 1 from an agent that can
  write the repository, and the fallback is a visible multi-file edit — a
  deterrent, which this document does not call protection. A signature
  stops forgery but not persuasion.
- **Nothing checks the reviewer's competence.** Human sampling was
  declined in Gate 1 §9. A blind spot shared between authoring and
  reviewing contexts passes review and reaches users.

None of these limits changes Gate 1. A request to remove the default-on
posture or complete user disablement, weaken truthful/gap reporting,
reduce the frozen 115-service commitment or the 19-host/six-CI roster,
reintroduce a verified/unverified host tier, add a fifth selectable
level, or introduce a Rig model/runtime returns to grilling.

## 16. Implementation Handoff

The implementer owns the smallest code that realizes these seams. They
may combine internal modules, but must preserve:

- the staged sanitation state machine;
- leaf-only `rig.json`;
- one exact-byte-activated `.rig/network-policy.json` safety authority;
- independent control/surface switches and fresh evidence generations;
- verified user-presence approval plus clone-local exact one-use
  consumption;
- one normalized evaluator across shell/web/MCP surfaces;
- cumulative grades and named dependency slices;
- the Policy → Context → Evidence ladder as the `minimal/mid/maximal` names
  for lint-format, with the selected grade a ceiling and no unexecuted level's
  assurance reported;
- lint-format's whole-repository component discovery, semantic command
  binding with ambiguity returned to the user, hybrid-plus preservation,
  user-approved partial-coverage exclusion, and per-component evidence-backed
  support claim;
- plan-bound read-only lint-format execution: nothing runs on selection, the
  read-only guarantee halts on mutation without auto-restore, autofix is a
  separately approved action, command drift halts, and every abnormal ending
  is its own non-passing state;
- explicit honest service dispositions and nonzero missing/no-op
  bindings;
- vetted real history activation and exact transactional remediation;
- typed no-clobber graft operations;
- atomic apply, policy, approval, and receipt evidence;
- one uniform adapter path for every `{host, axis}` in the roster, with auto
  onboarding emitting only detected hosts, explicit opt-in for absent hosts,
  and every emitted axis proven by a byte-landing test;
- the install line that names any out-of-repo write and carries no
  per-host claim string;
- refusal as a terminal activation state, and the declared-and-disclosed
  presence floor;
- user-global writes that append, attribute from the first install, and
  remove only their own repository's entries;
- the install stub, version `5.0.0`, all 55 uniquely named vendored skills, the
  upstream notice/provenance in every installed copy, and no publish workflow;
- report behavior and B1 containment;
- all frozen Gate 1 acceptance cases.

Implementation must not edit `business-spec.md`, `acceptance.md`,
`testing-infrastructure.manifest`, any manifested test byte, or
`../sources/logs/advanced-grilling.md`. Completion requires `npm test` green.

## 17. Oracle and Release Readiness

### 17.1 Oracle-signature prerequisites

This working specification is never frozen. Production implementation waits
only for the one signed oracle. Before the owner performs that ceremony:

1. all 95 current acceptance IDs have substantive executable targets and the
   traceability table names their real files/titles;
2. stale or tautological tests are removed or rewritten, and expected
   pre-implementation failures name missing product behavior;
3. `scripts/check-advanced-spec.js` runs first, verifies the v2 signature when
   armed, verifies every manifest digest, checks exact 95-ID equality and one
   present technical approach, then short-circuits code tests on failure;
4. `wiki/gate1/testing-infrastructure.manifest` is stable, sorted, and covers
   the verifier, acceptance tests, fixtures/helpers, and package script bytes;
5. the owner reviews the inferred correction from 56 to the physically present
   55 vendored skills, records a compliant signer identity/key-class statement,
   and signs the exact `rig-oracle-freeze-v2` message.

Once armed, a missing, malformed, stale, or wrong-namespace signature fails.
The implementation context must not edit either Gate 1 file, the manifest, or
any manifested test byte. A test defect is proposed to the key holder and
requires a new signature.

### 17.2 Release blockers

These block advertising or tagging version `5.0.0`:

1. all 115 leaves clear the unchanged signed `AT-SHAPE-6` target at declared
   Policy grade, with lint-format's higher-grade targets also green;
2. all 55 vendored skills are uniquely named, materialized for each supported
   selected-host skill surface, and accompanied by the approved MIT notice and
   provenance in every installed copy;
3. automatic onboarding writes only detected host trees, explicit opt-in is
   the sole absent-host override, and the full 19-host/six-provider matrix has
   passing contract and byte-landing evidence;
4. the named-tag installer, version, lifecycle, policy, safety, CI, reporting,
   and legacy compatibility targets all pass;
5. a fresh-session report-only review is pinned to the final technical-spec and
   catalogue digests with no unresolved finding;
6. `npm test` passes on the exact release bytes with the oracle verifier first.

Green legacy tests cannot remove any blocker. The owner-approved MIT ruling is
complete; release evidence must prove its notice/provenance conditions are
actually present.
