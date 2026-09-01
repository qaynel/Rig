---
date: 2026-08-21
source: agent
topics: the-catalogue, catalogue-contract, delivery-plan, host-and-ci-coverage, policy-signer-recovery, drift-and-secret-controls
decisions: AD-32, AD-33, AD-34, AD-26, AD-30
status: historical
---

# Gate 2 v0.6 — lint-format re-trace and the three round-3 findings

This is the Gate 2 (product-design) pass that Stage C of the acceptance-authoring
handoff asked for: trace D21's nineteen `AT-LF-*` cases into Gate 2 §13, narrow
the release boundary to the single lint-format leaf, design the one genuinely new
mechanism the lint-format intent introduces, and — since all four land in one
document and need one fresh review anyway — clear the three round-3 findings that
still blocked freeze. The candidate moves v0.5 → v0.6 and re-pins to the 68-case
Gate 1 digests. Gate 1 was not touched; its digests still verify.

## What was already there, and what was new

The trace's first job was to avoid re-inventing what the design already carried.
Most of the lint-format vertical is already specified for the whole catalogue:
plan-bound apply with exact-digest approval (§6.6), executable-first checks that
cannot fake a pass (AD-15, §9.1), diff-vs-repo scope (§9.2), the
record-before-write install journal with resume and reverse-walk removal (§7.6),
local redacted reporting with CI carrying only verdict/counts/rule-identities
(§9.3, `AT-REPORT-1`), and additive/absent/unknown CI (§11.2, AD-23). Those are
traced to the `AT-LF-*` cases by pointing at the existing sections; they needed
no new machinery.

The one genuinely new thing is the **grade ladder**. The lint-format intent
(GA-22) defines the three grades for this leaf's domain as Policy → Context →
Evidence — govern the change, understand it, prove it — where Evidence also
enforces in CI. The existing catalogue grades are `minimal → mid → maximal`
thoroughness (AD-4, §5.3, `AT-SHAPE-3`).

## AD-32 — map P→C→E onto minimal/mid/maximal, do not add an axis

The load-bearing decision. Policy/Context/Evidence are the **domain-specific
names** of the same cumulative `minimal/mid/maximal` dial, not a second,
orthogonal axis. `minimal = Policy`, `mid = Context`, `maximal = Evidence`. This
is the minimal-mechanism resolution and it is not merely cosmetic: by making the
ladder the same object as the existing dial, `AT-LF-8` (Context ⊇ Policy) and
`AT-LF-9` (Evidence ⊇ Context) are satisfied by AD-4's strictly-growing check-ID
composition and `AT-SHAPE-3`'s grade-invariant-identity/strict-superset property
that every service already has to pass. A separate axis would have duplicated
that machinery and created a second place for identity to drift.

Three sub-points fell out of the frozen intent rather than being chosen:

- **Commodity checks are inputs, not the grade (GA-22/23).** The component's own
  formatter/linter/type/static output feeds the Policy verdict; the ladder is
  about how much assurance is built on top, not which tool ran. So the
  disposition is `executable` (AD-15) — real repo-adapted processes run under the
  new §9.4 — and the leaf's current `convention`-marked, formatter/linter/CI-split
  catalogue entry is the superseded probe the roadmap already flags. The design
  is the contract that entry must be re-authored to, not the other way round.
- **"Lowest level capable of a definitive answer" is a ceiling, not a floor
  (GA-22).** The selected grade caps how high evaluation may climb; it does not
  force it that high. Evaluate cheapest-deterministic-first, return at the lowest
  level that yields a definitive verdict, never exceed the grade, never report an
  unexecuted level's assurance. Reporting a Policy result as Evidence, or silently
  running above the grade, is exactly what `AT-LF-7`/`AT-LF-9` catch.
- **Evidence ⇒ CI proposal, not CI auto-wire (GA-30, `AT-LF-13`).** Selecting
  Evidence *proposes* the whole-scope CI gate through §11.2/AD-23 unchanged;
  additive to verified existing CI, a separately-approved user-chosen plan for
  absent/unsupported, preserved-and-reported for unknown. Grade selection never
  auto-creates or owns CI. This reconciles GA-30 with "never auto-creates CI on
  selection alone" without new CI machinery. Recorded as §11.3.

## AD-33 and AD-34 — the lint-format-specific mechanisms

These are new because they are not shared catalogue behavior; they are what
lint-format needs on top of the shared spine.

- **AD-33 (§5.8):** lint-format's unit of work is a **component**. Whole-repository
  open-ecosystem discovery derived from the repository, semantic command binding
  by role with ambiguity returned to the user as a `needs_user_choice` state that
  blocks apply, hybrid-plus preservation of existing toolchains, user-approved
  partial-coverage exclusion of uncoverable components, and a per-component
  evidence-backed support claim whose whole-repository form is the AND over
  discovered non-excluded components (any exclusion suppresses the aggregate).
- **AD-34 (§9.4):** lint-format runs the repository's own untrusted code, so it is
  plan-bound and read-only by construction. Selection authorizes nothing; only an
  exact-digest-approved plan authorizes its listed read-only commands, working
  directories, and components, disclosed as untrusted code with `shell: false`
  explicitly not a safety guarantee. Diff-scoped by default in the component's
  working directory honoring its ignore rules; a read-only check that mutates the
  tree is detected (pre/post content-digest), halted before the next command,
  evidenced, and never auto-restored; autofix is a separately approved mutating
  action re-verified by re-running the check; command drift halts before running;
  every abnormal ending (`timeout`, `cancelled`, `missing_dependency`,
  `signalled`, `partial_output`, `command_not_found`) is its own distinct
  non-passing, blocking state.

## The three round-3 findings

- **Recovery credential class (AD-30 amended, §1/§8.4).** v0.5 called recovery
  credentials "hardware-backed" flatly, when D19 established that no SSHSIG key
  type proves hardware from the artifact. Fixed by mirroring the policy signer's
  declared-and-disclosed treatment: Rig verifies the signature and listing,
  records and discloses the declared `sk-*` class, and the user attests the key
  meets the live-human-act floor. The finding's second half — no test for an agent
  registering a fraudulent recovery key while holding a valid credential — is
  closed by making explicit that registration runs the same user-verification
  ceremony, so the credential an agent can register is one it cannot operate
  unattended later, plus a disclosed declared class so a weak registration is
  visible. Added to the `AT-PRESENCE-2` test row.
- **"Verified enforcement surface" vs the withdrawn tier (AD-26 amended,
  §1/§11.1).** The word `verified` had three senses that were never disambiguated:
  the banned host/axis *tier* badge (§11.1), the control/tool evidence status
  (§8.9), and Gate 1 `AT-BASE-2`'s frozen "verified enforcement surface" — a host
  that actually exposes a mechanical hook. The third is a legitimate capability
  property, expressed internally as `emitted`/`gap`/`unsupported`, and it never
  reaches the user-facing per-host claim surfaces `AT-CLAIM-1` greps. §1 and §11.1
  now record the three-way split at the point the tier was withdrawn.
- **Model-assisted triage channel (§8.2/§8.8).** v0.5 said enabling triage lets
  matched content reach the agent but described no channel. Fixed with one gated,
  default-closed field `secrets.model_assisted_triage` outside the control-AND
  model (it loosens, not protects): while false, no code path assembles matched
  content into agent context; while true, the pipeline attaches a bounded redacted
  `matched_content` field to the agent-visible triage view, dropped on
  deactivation with a fresh evidence epoch. One place to open, one place to test.

## Release boundary (D21) across §12.3/§17

Narrowed so `development.code-quality.lint-format` is the single release-blocking
leaf; the other 114 block only their own future support and the complete-catalogue
claim. The host/CI axis build-set = release-set statement is unchanged and stays
scoped to hosts; the leaf staging is the one deliberate asymmetry and it does not
reintroduce the withdrawn host tier.

## What this does not do

It does not freeze Gate 2 — that needs a fresh report-only review at the new
digest (`645e5536…`) and the intent owner's Gate 1 signature. It does not
implement anything. The `AT-LF-*` traceability rows name executable targets
(`advanced-lint-format-{discovery,grade,execution,ci,report,support,lifecycle}.test.js`)
that the lint-format slices build; they do not exist yet, exactly as the rest of
the table names targets still to be built.
