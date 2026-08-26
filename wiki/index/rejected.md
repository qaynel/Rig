# Rejected approaches

Everything this project considered and turned down, consolidated from four
places: Gate 2 §2.1, and the rejection lists in GA-11, GA-12, and GA-14.

This page exists because a rejected idea keeps coming back. Someone arrives
fresh, reasons from general practice, and proposes the thing that was already
argued out — usually the reasonable-sounding thing, which is why it took an
argument. The reason is the useful part, so every entry carries one.

---

## Gate 1 integrity

| Rejected | Why |
|---|---|
| Branch protection, code ownership, upstream-branch comparison | Charges every Gate 1 edit to commit history, which organisations audit — a stream of commits maintaining agent documentation is itself a cost. Withdrawn by GA-11a. |
| Comparing the working tree against the locally committed state | Stops an agent editing Gate 1 but not committing that edit, and agents commit routinely. It would have passed while failing at its only job. |
| Read-only file permissions, platform immutability flags | Reversible by the same agent that would make the edit. |
| Root-owned Gate 1 files | Genuinely stops an unprivileged agent, but breaks checkout and the owner's own editing, and does not survive a clone. |
| An unsigned digest pinned in Gate 2 | Forces a visible multi-file edit, so it is an audit trail and a deterrent. It is not a barrier, and this product does not describe deterrents as protection. |
| Checking the signing key's *class* from the artifact | No signature format available here carries proof an authenticator was involved. Specifying a check that cannot be implemented buys nothing and costs the reader their trust in the rest of the section (D19). |
| Treating a missing signature as unprotected-but-passing | Made D10 opt-out: any context wanting to edit Gate 1 could delete the signature first. Fixed by D17 rather than carried into freeze. |

## Policy, consent, and recovery

| Rejected | Why |
|---|---|
| Invariant clauses held in a separate file or repository | Assumes IAM — service accounts, branch protection, absent merge rights. Rig's agent has full shell access, so a second file is reached exactly as easily as the first. Same reasoning that withdrew D5, applied again rather than re-litigated. |
| Expiring or use-counted delegation grants | A clock defends against a threat exact-revision approval already contains, and makes Rig store new state whose staleness it must then keep honest. The owner went further and removed persistence entirely. |
| A committed approval marker, an unattended signing key, TTY confirmation alone | An agent with repository and shell access could self-authorize. |
| Canonicalized or section-level policy approvals | Makes normalization or mixed-revision precedence part of the authorization boundary. Exact validated bytes are simpler and stronger. |
| A Rig-imposed session or minute timer on one-use approvals | Expires unchanged user intent while adding clock machinery. Context change, explicit revocation, native expiry, and atomic consumption are the meaningful invalidators. |
| Repository-shared one-use approvals; category-only action identity | Allow replay, or authorize materially changed actions. |
| A `trust.json` bootstrap or reset command that replaces the policy signer without a pre-registered recovery signature | Makes the reset command the real root of trust. |
| Reinitialisation as an implicit recovery fallback | Anything that can trigger the fallback bypasses every credential check above it. If Rig ever supports starting over, it must be a distinct, separately named concept with no claim of continuing the old trust state. |
| An unlimited or self-extending recovery chain | The system is only as strong as its weakest fallback. GA-14e fixes the bottom of the chain at "refuse". |
| The everyday signing key doubling as its own recovery credential | Circular: losing that key strands recovery too, which is the exact failure recovery exists to solve. |
| An ordinary host-native confirmation popup as the recovery floor | Proves only that a UI event fired, not that an agent could not have triggered or synthesised it. |

## Install and removal

| Rejected | Why |
|---|---|
| Snapshot-restore as the uninstall mechanism | Guarantees a byte-exact return and silently discards every edit the user made since installing. On a file like `AGENTS.md` that is data loss dressed as cleanliness. The snapshot survives as *evidence* for the clean/best-effort claim — the load-bearing part of the idea. |
| Transactional install with automatic rollback as a second teardown path | A second implementation of a path the product already commits to building, and the classic failure of transactional installers is a failed rollback leaving worse debris than the original failure. |
| Lazy or retrofitted user-global attribution added on the second install | An unattributed first entry can never afterwards be safely removed, and retrofitting it is a migration this product does not want to owe. |
| A prune subsystem for orphaned user-global entries | `AT-HOME-2` does not ask for it. `policy status` names them; the user removes them. Disclosure rather than a subsystem. |
| Blind copies, malformed-config fallback, arbitrary shell operations, user-file deletion | Violate the graft/no-clobber posture. |

## Host and CI coverage

| Rejected | Why |
|---|---|
| A verified/unverified host tier in output or data | Drew a distinction the product never implemented, invited "please report" friction on the unverified path, and pushed authoring effort toward advertising decisions instead of shipping. Withdrawn 2026-08-17. |
| A per-host claim line in install output or run reports, in any wording | Same ruling. The only survivor is the out-of-repository write disclosure, whose home is `AT-HOME-1`. |
| A hard-coded list of advertised hosts, or a promotion event flipping an axis to verified | Every emitted axis is a release commitment on the same footing, so promotion is not a concept. |
| A confirmation prompt, extra flag, or acknowledgement gating any host path | Every emitted host has the same non-interactive install surface. A prompt on one host draws a tier by another name. |
| Aggregate host-level citations covering several axes | Evidence is owned by one `{host, axis}` pair and cannot be reused as an umbrella. |

## Catalogue and services

| Rejected | Why |
|---|---|
| Parallel or template-driven catalogue authoring | The failure this project is recovering from was 432 placeholder files produced at volume. Leaves are authored one at a time, by a context that has seen the ones before it. |
| Whole-group dependency pulls, or dependency-grade escalation | Violates exact razor-scoped auto-pull. |
| Persisted group selections, or grade-specific service IDs | Obscures the frozen per-service grade choice. |
| Duplicated full service prose per host | Creates footprint and drift. Prose is materialized once; host surfaces get pointers. |
| Installing test/security/infra engines during onboarding | Exceeds the frozen convention-and-binding delivery model. |
| Generic success bindings, silent binding skips, note-only scans, no-op remediation, marker-only live hooks, advisory-only CI verification | All fabricate completion without observable behavior. |
| A bundled naive history grep presented as the leak-scanner service | Creates a misleading security ceiling. |
| Model-assisted secret triage as the default, with redaction as the guard | Makes redaction load-bearing, and one bug ships a live credential to a third party. Recorded as a deliberate inversion of the product's usual configurability-over-paternalism rule. |

## Architecture and packaging

| Narrow per-site subprocess cleanup | Rejected for [[RIG-135]]: the same
  direct-child-only pattern had been reimplemented multiple times, including
  one incorrect fix. A shared guarded helper makes recursive cleanup the
  default and the ratchet catches regressions. |

| Rejected | Why |
|---|---|
| A second installer, target daemon, Rig model key, or mutable memory database | Duplicates the shipped spine, or violates B1. |
| YAML, a template engine, or a new validation dependency | Unnecessary for the strict JSON and cumulative-fragment contract. |
| Safety toggles in `rig.json`, or split safety/network authorities | Couples catalogue selection to authorization, or creates policy-precedence ambiguity. |
| A non-disableable baseline, a single coarse baseline switch, hidden enforcement after disablement | Contradicts complete user control and truthful status. |
| A combined scan/profile/install command, or automatic remediation | Makes sanitation ordering and user consent unprovable. |
| A build fingerprint embedded in the install stub | The stub and the source come from the same repository — anyone able to re-point a tag can edit a constant beside it. |
| `curl \| sh` installation | Rig's own default policy denies `remote_content_execution`. An installer that breaks the product's rule in its first five seconds cannot be defended. |
| Fixed Basic / mid / Advanced install packages | Deprecated by GA-9g. The catalogue is the product; the only per-repo preset is the dynamic scan recommendation. |
