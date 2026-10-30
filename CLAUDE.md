Before acting, read `rig/corpus/routing.md` and route this task through its
skill table — its "Task weight" section sets a lighter path for single-step
tasks; everything else uses the full cadence below.

# Rig Development

## North star — locked by the owner; never re-ask, never contradict

These are settled. Re-raising any of them has repeatedly cost the owner time.
Before any scope, design, test, or support question, check it against this list.

1. **Rig is one central corpus.** Skills, pipeline, catalogue services,
   standards, and grafting instructions live once, in the Rig corpus. The
   user's own coding agent unpacks it onto their repository with clear
   onboarding instructions — a mechanical projector for known hosts, the agent
   itself for unknown ones. Never frame scope, tests, docs, or support per host
   or by counting hosts. Design: `wiki/reasoning/2026-09-08-dynamic-offboarding-architecture-brainstorm.md`.
2. **Onboarding is agent-driven and adaptive.** The host agent grafts the
   smallest useful set onto what the repository already has; Rig code does not
   infer. `wiki/reasoning/2026-08-31-path-b-product-direction.md`.
3. **Markdown-only Tier 1 is retired.** Rig may ship scripts, markdown, and MCP;
   a sync engine is wanted. Do not reject an approach on markdown-only grounds.
   `wiki/reasoning/2026-09-04-structural-workflow-fix-grilling.md` (B2).
4. **The human-signed oracle is the gate.** Agents never edit frozen tests; the
   owner re-signs, batched into one session. (B3)
5. **Close bar:** code is cheap. Fix it; "replaced" needs a strong written
   reason; difficulty or priority is never a reason.
   `wiki/reasoning/2026-10-13-close-everything-owner-answers-round1.md`.
6. **Superseded for the rebuild:** see the rebuild design document named in 29.
   `wiki/reasoning/2026-10-13-close-everything-review-owner-fetch.md`.
7. **The canonical corpus uses one new root, `rig/corpus/`.**
   `wiki/reasoning/2026-10-13-close-everything-review-owner-corpus-root.md`.
8. **Remove tier wording now; keep the existing flag compatible for one release.**
   `wiki/reasoning/2026-10-13-close-everything-review-owner-tier.md`.
9. **Service checks use available tools; missing tools are named gaps with setup guidance.**
   `wiki/reasoning/2026-10-13-close-everything-review-owner-tools.md`.
10. **Proven duplicate services may merge with written reasons and selection compatibility.**
    The count may fall below 115; required capabilities remain covered.
    `wiki/reasoning/2026-10-13-close-everything-review-owner-merges.md`.
11. **QA-to-production promotion uses automated checks only on the exact QA commit.**
    Include automated health and real-download clean-install checks; no outside-repository manual install gate.
    `wiki/reasoning/2026-10-13-close-everything-review-owner-promotion.md`.
12. **Report supported host hooks Rig does not install as available but not integrated.**
    Reserve `emitted` for a real host-consumed artifact with byte-landing proof;
    reserve `unsupported` for a vendor surface that does not exist. The gap is
    explicit in the release contract rather than a speculative hook claim.
    `wiki/reasoning/2026-10-18-host-hook-honest-gap-owner-decision.md`.
13. **One trust root: the Gate 1 key is the only signing key Rig uses.**
    It is the only key that signs, approves, or recovers anything. Plan
    approvals, policy, and receipts verify against it alone. Rig has no
    separate policy-signer setup, recovery registration, trust-on-first-use
    fallback, `trust.json`, or independent `.rig/allowed-signers` list.
    `wiki/reasoning/2026-10-20-one-trust-root-owner-decision.md`.
14. **Rig's intended product is an agent-led, end-to-end AI-SDLC harness.**
    The human supplies intent, product judgement and protected authorisations;
    the host agent performs the engineering work; Rig supplies the workflow,
    gates, memory and evidence. The complete customer journey and source-level
    open-source inheritance must be designed before more implementation.
    `wiki/reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md`.
15. **The active working-memory view starts at an 8 KB cap.** Richer memory,
    provenance and historical evidence remain separately retrievable; ordinary
    memory is mutable and does not need a signature. Semantic retrieval and
    safe consolidation are in scope. Same owner directive.
16. **Lock requirements and acceptance criteria together before technical
    design.** The technical design stays editable and outside the signed
    oracle. Hardware-backed SSH signing support must be specified and verified
    within the existing single trust root. Same owner directive.
17. **Use the least expensive reliable mechanism.** Deterministic tools come
    first, then a suitable low-cost agent; stronger models handle complex or
    risky judgement. Keep the three-minute trace cadence and design automatic
    low-cost compaction with fidelity checks and protected evidence retention.
    Same owner directive.
18. **Source-level open-source inheritance is mandatory for the expansion.**
    Pin candidates and record exact components, licences, keep/discard scope,
    integration and verification. Neither wholesale framework adoption nor
    a merely similar home-grown design counts as reuse. Same owner directive.
19. **Atomic bidirectional traceability is a permanent Rig invariant.** Every
    independently testable requirement has one directly mapped primary
    acceptance criterion and proving test; criteria, journeys and implementation
    packages must all map back to the approved contract. Requirements, criteria
    and the test manifest lock together under the existing owner key before
    technical design. The complete public product, not only the local core,
    must be planned before implementation.
    `wiki/reasoning/2026-10-24-final-product-definition-owner-directive.md`.
20. **Offline meaning-based memory search is required in the public release.**
    A fresh supported installation must search by meaning without a network
    call, provider account or first-run model download. Cited lexical search
    remains a fallback during a local failure, never proof that this required
    capability works. The shipped artifact and clean-install checks must cover
    the local model/runtime and their size, licence and integrity.
    `wiki/reasoning/2026-10-24-offline-semantic-search-owner-decision.md`.
21. **Gate 1 preparation for the new AI-SDLC programme is authorised; signing
    and general implementation are not.** In scope: the 84 proving tests and
    30 fixtures in a separate evaluation lane, the deterministic traceability
    validator, extending the existing signer to select the new programme
    without touching the signed 6.0.0 oracle, signing/verification tests,
    recorded preimplementation baseline, and the signing handoff. New
    acceptance failures must never turn the existing repository CI red.
    `wiki/reasoning/2026-10-24-gate1-preparation-owner-authorisation.md`.
22. **One-to-one traceability is a shipped Rig product feature, not a project
    convention.** Requirement → primary acceptance criterion → proving test →
    evidence, enforced by a deterministic validator in the canonical corpus,
    in routing and in Gate 1 pre-flight, installed into every host repository.
    Decompose compound requirements rather than widening a test to keep IDs
    aligned. Implementation planning is blocked while the protected graph is
    incomplete; a post-signing requirement change needs an authorised
    amendment. Same owner authorisation.
23. **Reuse an existing embedding model and inference library; never build
    one.** Transformers.js/MiniLM is a starting candidate, not the final
    choice — Chinese and other open-weight ecosystems are in scope. Select on
    smallest complete installed footprint (weights, tokenizer, runtime, native
    binaries), redistributable licence, fully offline inference, supported-OS
    coverage and acceptable latency. No new vector database, daemon,
    model-serving framework or provider dependency without a requirement that
    demands it. Same owner authorisation.

24. **Human authentication need not be a plug-in USB security key.** The
    owner will not buy one. This owner's own configuration remains the enrolled
    Secure Enclave key gated by Touch ID. Which other mechanisms count, and
    which do not, is decision 27. The signed contract still names one
    security-key algorithm and must be amended before that text changes.
    `wiki/reasoning/2026-10-24-human-authentication-owner-decision.md`.

25. **Ship the whole kit; the host agent decides what to graft.** Rig is a
    starter pack thrown at the user's agent. Every capability ships complete
    and advertised with a plain description of what it does and when it helps;
    the agent on the user's side reads the repository, sees what is offered,
    and brings in only what that project needs — possibly nothing, if the
    project already has an equivalent. **Never ask the owner whether something
    belongs in the default install, how much to ship, or which hosts get
    what.** That question is a category error and the owner has answered it
    repeatedly. Offline meaning-based search ships by this rule: included,
    described, agent's choice.
    `wiki/reasoning/2026-10-24-ship-the-kit-agent-decides-owner-decision.md`.
26. **Release approval requires real authentication, and the authentication
    must leave no secret behind.** Publishing cannot proceed on a typed name.
    It requires an authentication the agent cannot perform (owner decision 24),
    and the implementation must be complete rather than half-done: a principal
    and its key are both part of the check. No identity, key material or
    secret may be written into the repository, a commit, or anything that
    reaches GitHub. Same trace.
27. **User sign-off is configurable.** During onboarding the agent explains
    the modes and records an explicit choice. There is no silent default and
    no automatic downgrade when a strong key is missing. The modes are: a
    verified signature (security-key algorithms prove a person was present;
    an ordinary algorithm proves the key and the bytes, and a platform prompt
    such as Touch ID is designated rather than proven by the algorithm); a
    platform prompt, which must not be described as human presence when the
    agent could supply it, including `sudo` and a cached password; and a
    written acknowledgement, which is a declaration the owner may choose and
    which an agent with file access can forge. Weakening the current mode
    requires authorisation under that mode. One trust root verifies
    signatures. A release that must be signed still requires a real signature
    even when everyday approval is a lower mode. A typed name is not a
    signature.
    `wiki/reasoning/2026-10-24-configurable-user-signoff-owner-directive.md`.

28. **QA CI, production certification and published-byte verification are separate.**
    Feature → `qa-prod` needs ordinary unprivileged CI, never a release,
    publication digest or interactive owner signature. Exact-QA production
    promotion retains comprehensive health, provenance and binding review.
    Authenticated publication precedes real published-archive verification;
    publication must not depend on its own future public-download evidence.
    Existing-CI identities verify external checks; one batch signed by the
    existing owner key certifies provisional integrated local work for release.
    Review uses comprehensive preflight, one full binding review, batched fixes
    and targeted re-review with explicit escalation, preserved history and no
    suppression of serious new defects. Provider failures consume no verdict
    attempt. Exactly one additional binding attempt is authorised for PR159
    only after readiness; it is not a counter reset.
    `wiki/reasoning/2026-10-27-pr159-owner-lifecycle-and-convergence.md`.

29. **The Rig rebuild is governed by one design document:**
    `wiki/specs/rebuild/design.md`. Every product decision, conflict ruling and
    open question for the rebuild lives there, not here.

Product decisions go into the wiki (for the rebuild, the design document in
29) in the same change; this file keeps only pointers.

Rig installs a curated agent workflow into other repositories from one central corpus.
Rig supports the repository's static agent-host entrypoints through
`rig/bootstrap.sh`.
Follow `rig/corpus/standards/ai-sdlc.md` for the development lifecycle.

## Working from the wiki

`wiki/agent-primer.md` is this project's first source of truth for an agent.
Read it before touching the code. It is one short page: it points at
`Home.md` for the map, `status.md` for what is true now, and the specific
topic hubs and indexes a routing decision needs, and it names the rule that
the wiki (not grep) holds the reasoning behind every part of this project.
Follow the links it holds only as far as the task requires. Do this before
asking the user for context, making suggestions, or sketching a solution.

Keep the wiki in sync with the branch. Any change that moves what is true — a
decision, a spec, a status, a rejected approach — updates the wiki in the same
change, following `wiki/reasoning/README.md`: file new thinking verbatim under
`reasoning/`, then update the topic hubs it touches and the decision index. A
wiki that has drifted from the branch is a defect, not stale documentation.
Reference it, update it, maintain it; it is part of the deliverable.

On a task that runs long or has several steps, do not hold everything for a
finish-line summary — that loses the work if the session is cut off partway
through. Check the time and file a dated reasoning trace with what was just
done, what is in flight, and what is next at least every three minutes of
active work; run `node scripts/build-wiki-index.js` rather than hand-editing
the generated `wiki/status.md`. Record a new understanding
or an approach that just failed the moment it happens — as its own reasoning
trace, or in `index/rejected.md` / `index/traps.md` if that is what it is —
rather than batching it for later. A session picking up cold should be able to
resume from what is written, not from re-deriving it or reading the lost
conversation. A single-step task on the lightweight path (`rig/corpus/routing.md`
§Task weight) skips this cadence; it applies once the task is multi-step or
changes what's true in the wiki.

## Delivery SOP

Releases follow `rig/corpus/standards/change-management.md` — one ordered
sequence from candidate freeze to tracker closure, enforced by
`node scripts/check-deployment-gate.js --receipt <path>`. Do not reorder it and
do not carry evidence across a code change.

Follow `rig/corpus/standards/delivery-sop.md` for multi-step changes. The live
closeout artifacts are in `wiki/specs/close-everything/` (`task-list.md`,
`agent-prompt.md`).

## Talking to the user

Every message to the user follows `rig/corpus/rules/communication.md` (installed
as `.rig/rules/communication.md`). Treat the user as your product manager: send
the least information needed to decide, with the overall picture intact. Ground
the problem, the real options with their business costs, one recommendation, and
one decision per question in the wiki's current truth and product spirit. Wiki
paths, section numbers, and decision IDs stay out of the first-pass reply; they
belong in the wiki and the diff, and are reproduced on request.

## Architecture

- `rig/corpus/routing.md` is the single task router.
- `rig/corpus/skills/` contains Rig's curated phase owners and grafts.
- `rig/corpus/rules/rig.md` activates the implementation rule.
- `skills/rig/SKILL.md` is the unchanged Rig source component.
- `.claude/skills/` and `.agents/skills/` are install targets for native Claude
  and Codex discovery; their payloads must stay identical.
- `rig/bootstrap.sh` installs from `rig/manifest.json` through
  `rig/lib/payload.js`; optional `--hosts` / `RIG_HOSTS` selects a host subset.
  Vendored-skill code and the `.rig/plumbing` tree install only under
  `--with-runtime`; a default install lands every `SKILL.md` but no code.
- `plugin.yaml` and root `__init__.py` are the first-class Hermes plugin. The
  Hermes tests and the `.venv`/pandas-backed benchmark import in `npm test` are
  part of the supported surface.
- `tests/rig-bootstrap.test.js` proves the fresh-repo multi-host install.
- `wiki/Home.md` is the project knowledge entrypoint. File future intent-owner
  reasoning verbatim under `wiki/reasoning/`, then update its topic hubs and
  decision index as `wiki/reasoning/README.md` requires.

Installed repositories never receive secrets or generated `.env` files.
Scripts, markdown, and MCP may ship (North star 3).

## Checks

`npm test` is the full CI gate: it runs `scripts/check-rule-copies.js`,
`scripts/check-versions.js`, the Node test suite, and the pi-extension tests —
the same commands `.github/workflows/test.yml` runs. Run it locally and confirm
it is green before pushing; do not push on a red or unrun suite. `npm run
test:rig` is a fast subset (the bootstrap test only) and is not a substitute.
Inner-loop red/green uses `npm run test:rig` or the single relevant test file,
never the full gate — see `rig-tdd`; run the full gate once, right before push.

```sh
npm test        # full CI gate — must pass before push
npm run test:rig  # fast bootstrap-only subset
```

The rest of the repository is the existing Rig component and its adapters.
When changing those internal files, keep their established tests and generated
copies green; do not route new Rig behavior through the old plugin runtime.
