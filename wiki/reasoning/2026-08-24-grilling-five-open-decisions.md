---
date: 2026-08-24
source: agent
topics: catalogue-contract, authored-service-gate, lint-format-roadmap, distribution-and-release, the-mvp-roadmap
decisions: (pending owner ruling — D25+ to be assigned on sign-off)
---

# Grilling session — five open decisions blocking the v5.0.0 close-out

Opened via `rig-grilling` to establish intent + acceptance for RIG-108, 112,
113, 115, 120 before any implementation. This trace records the framing put to
the owner and the agent's recommendation on each. No oracle was edited; nothing
here is frozen until the owner rules and (where the ruling touches
`wiki/gate1/`) re-signs.

Grounding read first: `status.md`, `tickets/RIG-108/112/113/115/120.md`,
`index/decisions.md` (esp. D24 beta scope, D21 lint-format leaf), reasoning
README. Findings in those tickets (verified 2026-08-24) are taken as current.

## RIG-108 — three zero-caller runtime modules

Verified: `enforcement.js`, `graft.js`, `git-dispatch.js` have zero production
callers (only their own oracle tests reach them by direct `require`).
`release-evidence.js` is NOT in scope — it has a real caller
(`scripts/review-receipt.js`) and only needs a through-the-CLI test.

Each of the three is a *named* capability (enforcement gate, graft mechanics,
git dispatch), so "dead code" is not automatic. The real question is D24 beta
scope: is each capability inside the "MVP in one pass" boundary or not?

- **Wire** = add to `cli-advanced.js`/`materialize.js` behind the RIG-107 apply
  path + a shipping-path test. Cost: more surface to support at GA.
- **Delete** = remove the module AND retire its orphaned cases in the signed
  `acceptance.md` → owner re-sign. Cost: a named capability leaves the product;
  reversible later but re-adds cost.

Agent recommendation: **wire `graft.js`** (grafting reads as a headline
capability via the catalogue apply path); **delete `enforcement.js` and
`git-dispatch.js`** as outside D24 beta scope (policy activation and lifecycle
already ship their behavior without them). Deletion batches into the release
re-sign (RIG-120).

## RIG-112 — freeze the catalogue contract now?

Mechanical authored-service gate already exists and is green across all 115
leaves. Two things remain: (1) the contract itself is a working Gate 2 spec,
not frozen; (2) the *semantic* "is this leaf genuinely service-specific" check
is a manual release-time exact-digest review, not CI.

- **Freeze now** = add catalogue-contract artifacts to the signed Gate 1 set →
  permanent, re-sign-only to change. Cost: locks a contract while the semantic
  gate is still manual; premature lock is expensive to unwind.
- **Leave unlocked** = keep maturing the semantic gate; land the mechanical
  CI-over-115 confirmation + a stronger specificity heuristic under the ordinary
  gate now. Cost: contract can still drift until frozen.

Agent recommendation: **land the mechanical CI-over-115 confirmation now under
the ordinary gate; do NOT freeze the contract yet.** Freeze is a one-way door
and should wait until the semantic gate is real, or be a deliberate separate
owner decision.

## RIG-113 — the lint-format "better alternative" rule + ranked lists

Promise is frozen (GA-16/GA-19): preserve the repo's toolchain; offer one if
none; propose a "better supported alternative" only with explicit approval. What
is undefined is the content of "better."

Proposed rule (needs sign-off): propose a replacement ONLY when the current tool
is (a) unmaintained/EOL per a declared signal, (b) can't cover a selected
component, or (c) absent — never model taste. Ranking comes from a fixed,
declared per-ecosystem preference list.

The ranked lists and the EOL/coverage signals are real product content only a
human should author/approve. Agent can draft a starting list; owner must
approve.

Agent recommendation: **approve the rule shape now**; owner supplies/approves
the per-ecosystem ranked lists + EOL signals (agent can draft a first pass to
react to). Landing re-signs Gate 1.

## RIG-115 — author the lint-format acceptance cases

Three contracts have frozen intent but no `AT-LF-*` cases yet: Applicability
(partial cover installs what's covered, reports the rest unprotected, suppresses
whole-repo claims), Execution consent (select runs nothing → plan approval
authorizes only listed read-only commands → mutating fix needs separate approval
→ fix under read-only approval fails visibly), Shell trust (repo tasks stay
untrusted under policy/privilege/secret/network/resource limits even with
`shell:false`; argv-escape denied visibly). Substrate exists in
`.rig/bin/check.js`.

No content decision blocks this — the real ask is: draft the specific `AT-LF-*`
case list, then owner re-signs.

Agent recommendation: **agent drafts the `AT-LF-*` cases as externally
observable examples**; owner reviews + re-signs. Batch into the RIG-120 re-sign.

## RIG-120 — v5.0.0 release ceremony

Branch gate green (380/380 + 15/15 + 3/3). Three owner-only steps remain, in
order: fresh independent review receipt bound to the exact PR worktree →
re-sign (`approve-gate1.js`, key configured on this machine) → `npm test` on
final bytes then `git tag v5.0.0 && git push`. `check-versions.js` enforces
tag == pinned version.

Bundled open call: naming mismatch — `install.sh`/README say `qaynel/Rig`, the
actual remote is `qaynel/Rig-v0.1` (RIG-117). Canonical name must be decided
before publish, then the other fixed to match.

Agent recommendation: **pick `qaynel/Rig-v0.1` as canonical** (it's the real
remote; changing the remote is more disruptive than fixing two references) OR
rename the remote to `qaynel/Rig` if the cleaner name is wanted long-term —
owner's call. Then batch every oracle change ruled above (RIG-108 deletions,
RIG-113 lists, RIG-115 cases, optionally RIG-112 freeze) into ONE re-sign, run
the fresh review + gate on final bytes, tag + publish.

## Sequencing

RIG-113 and RIG-115 produce oracle content; RIG-108 (deletions) produces oracle
removals; RIG-112 (if frozen) produces oracle additions. All of these should be
resolved BEFORE the RIG-120 ceremony so they fold into a single re-sign rather
than several. The naming decision (RIG-120) is independent and can be made now.
