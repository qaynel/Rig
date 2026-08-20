# Timeline

How the design moved. Useful when a document's date matters more than its
content — a doc written before 2026-08-17 still believes in the host tier, and
one written before 2026-07-24 still believes in installable tiers.

---

## 2026-07-16 — Foundational grilling begins

`G1`–`G11` settle what Rig is: a curated blend with superpowers × gstack as the
primary axis, shipped as its own harness rather than a fork. Tier 1 is the MVP —
a markdown-only bootstrap with one shared `routing.md` and one-line host
pointers. The materializer is deferred entirely to Tier 2. The project gets its
name (`G10a`).

## 2026-07-21 — Advanced grilling opens

`GA-1` narrows Advanced to capabilities B (harness security), C (testing
pipeline), and D (spec→test→code), host-agnostic. The local-model runtime and the
repo-scoped memory store go to Tier 3. `GA-2` locks the brain fork to **B1** —
Rig authors config, the host agent executes it. No Rig runtime, no model key.

Later the same day, `GA-9` dissolves the fixed tier stack into a two-axis
à-la-carte catalogue driven by a repo-scan recommendation lens.

## 2026-07-23–24 — The catalogue takes shape

`GA-9g` deprecates tier naming completely: there is no installable Basic, mid, or
Advanced. The catalogue *is* the product. `GA-9i` separates the two securities —
agent-tech safety as an always-on baseline, product security as a selectable
family. `GA-9k` settles the grain at four levels: **family → group → service →
grade**. `GA-9k`–`9n` enumerate all four families and 115 leaves.

`GA-8` authors the first acceptance set at property level. **Gate 1 freezes at 16
cases** on user sign-off.

## 2026-07-25 — GA-10, the audit re-grill

The frozen Gate 2, later SOW rulings, a placeholder catalogue, and
green-but-incomplete tests are found mutually inconsistent. Eleven rulings
establish `technical-spec.md` as sole Gate-2 authority, make all 115 leaves
production commitments, and require one honest outcome per service.
**Set moves to 38.**

## 2026-07-26 — Three revisions in one day

**`D1`–`D9`, the claim/build split.** A readiness audit finds the intent
unshippable: it made release conditional on first-wire evidence for 19 hosts and
six CI providers, requiring licensed vendor products no implementation effort can
substitute for. The resolution separates what Rig *builds* from what Rig
*claims*. **Set moves to 45.**

**`D10`, Gate 1 integrity.** Gate 2 design work finds the `D5` process control
doesn't fit how this repository is used. `GA-11` withdraws branch protection and
upstream comparison; the replacement is a signature over Gate 1's digest that
does not run through git at all. Mechanism change only — set stays 45.

## 2026-07-28 — GA-12, the lifecycle re-grill

A sweep for *unstated* behavior rather than wrong behavior. The finding: Gate 1
described in detail how Rig arrives in a repository and said almost nothing about
how it leaves, how it fails, or what it does with what it finds.

Eight rulings become `D11`–`D18`: uninstall, install resume, session-scoped
delegation, no invariant tier, local-only findings, deterministic secret
detection, gate arming, and migration excluded. One is a defect fix — `D17`
closes the hole that let a context delete `gate1.sig` and proceed under a warning.
**Set moves to 52.**

## 2026-08-13 — D19, the presence floor corrected

Gate 2 design work goes to satisfy `D10`'s presence floor and finds it
unsatisfiable. No SSH signature attests hardware presence: `ssh-keygen` records
authenticator attestation only at key generation, verification has no option that
consults it, and the allowed-signers grammar cannot express a touch requirement.

`D19` restates the floor as a property of the *key* rather than a claim about the
artifact, and makes the intent owner the one who attests it. A correction of a
false requirement, not a relaxation. Set stays 52.

Gate 2 v0.3 is rewritten against the 52-case set. The roadmap is checked against
the files on this date — and has not been updated since.

## 2026-08-17 — The host-tier amendment

The executable-specification-gate design finds that Rig ships one configuration
for every host and has never observed enforcement fire on any of them, while the
verified/unverified tier from `D1`/`D2`/`D3` drew a distinction the product never
implemented.

The tier is removed outright. Every host emits through one uniform path, proven
the same way — by automated tests that the correct bytes land in the correct
paths, never by a human exercising a host. Four cases are deleted.
**Set moves to 48.** Gate 2 v0.4 is rewritten.

## 2026-08-19 — Two amendments, and a failing review

**`GA-13` / `D8` corrected.** A different model cannot be established from a
self-declared authoring-model label. The requirement becomes a fresh session,
report-only operation, and an exact-digest receipt. Model identity is no longer a
release condition. Set stays 48.

**`GA-14` / `D20`, policy-signer recovery.** The round-2 review finds Gate 2 had
built a full recovery ceremony for the policy signer with no Gate 1 requirement
behind it — exactly the kind of lever the `D5`→`D10`→`D17`→`D19` sequence spent
four revisions keeping out of an agent's reach. The intent owner grills the
requirement rather than stripping the capability. **Set moves to 49.**

Gate 2 v0.5 is written against it, reviewed at its exact bytes — and **fails**,
with `AT-INSTALL-1` unresolved.

**The wiki is built.** `project-dev-docs/` becomes `wiki/`.

## 2026-08-20 — Vertical-slice probe, and AT-INSTALL-1 resolved

The intent owner's first attempt at authoring the full catalogue at once is
retrospected and abandoned mid-flight; the agreed test becomes one real leaf
first. `development.code-quality.lint-format` is authored end to end, and its
third acceptance probe — a deliberate mid-apply interrupt — forces the
round-3 blocker out of the spec and into running code: a failed apply rolled
back the already-applied writes and left no manifest. `rig/lib/apply.js` had
never implemented §7.6's manifest at all.

The blocker is resolved: §6.6, §10, and `AD-10` are edited to state the
manifest-and-resume model as apply's only failure behavior, and
`rig/lib/apply.js` gets the `.rig/install-manifest.jsonl` record-before-mutate
and resume mechanics. Gate 2's digest changes; the round-3 receipt is void.
Three round-3 findings remain open. That is where the project stands; see
[status](../status.md).

---

## Reading a document by its date

| If it was written before | It still believes |
|---|---|
| 2026-07-23 | There are installable Basic / mid / Advanced tiers. |
| 2026-07-26 | Gate 1 is protected by branch protection and reviewed commits. |
| 2026-07-28 | Rig has no uninstall path, and delegation is persisted. |
| 2026-08-13 | The signature itself proves hardware presence. |
| 2026-08-17 | Hosts are split into verified and unverified. |
| 2026-08-19 | The case count is 48 or 52, and review requires a different model. |
