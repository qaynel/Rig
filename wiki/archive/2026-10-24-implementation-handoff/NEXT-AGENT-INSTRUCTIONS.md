# Instructions for the next agent — take Rig's AI-SDLC from implemented to deployment-ready

You are the incoming coordinator. WP01–WP10 are implemented and verified
locally. WP11 (public release candidate and QA) is not. Your job is to close
the gap between "88-test acceptance lane green except one hardware-bound case,
uncommitted" and "deployment-ready": reviewed, committed, archived, published
with real-download proof, and carrying an exact-commit QA evidence chain.

Read this file top to bottom before touching anything. It is written so you can
start cold, with no transcript.

---

## 0. Hard rules you inherit

These are not style preferences. Breaking any of them has a cost the owner has
already paid once.

1. **Never edit a protected file.** The protected set is 30 files listed in
   `wiki/gate1/ai-sdlc/contract.manifest`: specs
   `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`, `16-test-manifest.md`,
   `17-customer-lifecycle.md`; `rig/catalog/baseline/check-traceability.js`;
   `tests/traceability-invariant.test.js`; and all 25 files under
   `tests/ai-sdlc/` (24 test files plus `_harness.js`). Get the list from the
   signer itself, never from memory:
   `node -e 'console.log(require("./scripts/approve-gate1.js").programmeProtectedFiles(process.cwd(),"ai-sdlc").join("\n"))'`
2. **The tests are the oracle.** If a proving test looks wrong, you are
   probably wrong. Verify the claim against the actual code before escalating.
   A previous worker reported PT-037 as an unsatisfiable contradiction on the
   grounds that `String.prototype.trim()` strips the characters in question; it
   does not — `trim()` removes ECMAScript WhiteSpace and LineTerminator only,
   not U+200B, U+200C, U+200D or U+2060. If after that check a contradiction is
   real, **stop and prepare an unfreeze request**. Do not work around it.
3. **Workers never certify their own completion.** Every diff gets an
   independent review by something that did not write it.
4. **No pushing, no pull request, no release publication, no GitHub issue
   changes, no production change without separate explicit owner
   authorization.** This includes `git push`, `gh release create`, and anything
   that mutates an external system. Committing locally is also currently
   unauthorized — see §7.
5. **Do not switch branches, discard working-tree changes, reset files, or
   `git stash`.** The branch is `vaibhav-kodiyan/gstack-pasted-text`. 233
   untracked paths carry the entire delivery; losing them loses the work. The
   stash stack is shared with other worktrees.
6. **North star first.** Read `CLAUDE.md`'s 23 owner-locked items before any
   scope, design or test judgement. Items 11, 12, 13, 19, 20, 21, 22 and 23 all
   bear directly on what remains.
7. **Three-minute trace cadence.** File a dated reasoning trace under
   `wiki/reasoning/` at least every three minutes of active work; regenerate
   `wiki/status.md` with `node scripts/build-wiki-index.js`, never by hand.

## 1. Model tiering — how to actually do the work

The owner's directive: use the smallest model that can do each job, and win on
volume rather than on one large agent grinding serially.

| Work | Model | Shape |
|---|---|---|
| Mechanical edits, file moves, digest recomputation, running a named command and reporting output, writing a single documented function against a single failing test | **Haiku** | Many in parallel, one file each, disjoint ownership |
| A section of work: own a work package, fan out Haiku workers, verify their output before reporting up | **Sonnet** | One per section, each spawning its own Haiku fleet |
| Failure investigation when a gate goes red | **Sonnet** first | Investigate and diagnose; hand the fix to Haiku |
| Only if Sonnet cannot diagnose it | **Opus** | Diagnose only; Haiku applies the change |
| Contract adjudication, protected-set judgement, embedding/architecture decisions, final integration | **You (Opus)** | Never delegate these |

File ownership must be **disjoint by construction** — one module, one owner. The
previous wave split by module for exactly this reason and had zero write
collisions.

## 2. Verify the ground before you change it

Run these four, in order. If any disagrees with the recorded value, the branch
moved and the rest of this document is suspect — stop and re-establish state.

```sh
node scripts/approve-gate1.js status --programme ai-sdlc
# expect: ai-sdlc contract protected: principal=gate1-owner

node scripts/approve-gate1.js status
# expect: Gate 1 protected: principal=gate1-owner
#         fingerprint=SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY
#         Oracle verified: 16 files, 95 acceptance cases

node scripts/check-traceability.js
# expect: 84 requirements / 84 criteria / 84 proving tests / 30 fixtures /
#         20 journeys / 11 packages — graph complete

RIG_PUBLIC_ARCHIVE=$(ls .context/dist/rig-public-*.tar.gz | head -1) \
  node --test tests/ai-sdlc/*.test.js
# expect: tests 88, pass 87, fail 1 (PT-017 only)
```

If `.context/dist/` is empty, rebuild the archive first:
`node scripts/build-public-archive.js`. `.context/` is gitignored, so the
archive never survives a clean checkout — this is why the real-download leg is
still open.

Without `RIG_PUBLIC_ARCHIVE` the lane reports 85/88: PT-068 and PT-077 become
environment-bound. That is the harness refusing to pretend, not a regression.

Then the repository gate, which must stay green at all times:

```sh
env -u GITHUB_TOKEN -u GH_TOKEN npm test
```

**Do this before anything else.** The last recorded run was not clean: 1311
tests, 1304 pass, 1 fail, 1 cancelled. A migration test hung for twenty
minutes and a spawn-guard test could not delete its own temporary directory.
Both look like contamination from an earlier run that was killed with its
child processes still alive, but that was never confirmed. Check for stray
`node --test` processes, re-run on a quiet machine, and if either failure
survives, stop and investigate it before touching anything else. Full output
is in `rig-implementation-handoff/evidence-npm-test-2026-10-24.log`.

The `env -u` is required: the gate behaves differently with a GitHub token in
the environment, and the owner's machine has one.

## 3. What exists, in one table

Twenty new files under `rig/catalog/baseline/` (nineteen capabilities the
signed harness resolves by name, plus `embedding.js`, a runtime dependency of
`memory`, `upgrade` and `portability`). `README.md` in this directory has the
full module → work-package → proving-file map and the persisted-state column.
`verification/acceptance-coverage.md` has every PT with its file and state.

The embedding stack is the one architectural decision worth knowing cold:
`minishlab/potion-base-2M`, MIT, a model2vec static distillation of
`baai/bge-base-en-v1.5`. It ships as an int8 per-row-quantised table
(2,007,904 bytes) plus a WordPiece vocabulary (219,690 bytes) in
`rig/catalog/baseline/assets/potion-base-2m/`, read by ~80 lines of pure
JavaScript. No ONNX runtime, no native binary, no new npm dependency, no
first-run download, no provider account. That is what satisfies North star 20
and 23. Do not replace it with a transformer stack without an owner decision;
Transformers.js/MiniLM was measured and rejected at ~100 MB plus per-OS native
prebuilts.

## 4. The ordered path to deployment-ready

Each phase names its exit evidence. Do not start a phase before its
predecessor's evidence exists.

### Phase A — Independent report-only code review (no owner decision needed)

Nothing on record has reviewed these bytes independently. The brief requires
it, and under rule 3 the implementation cannot certify itself.

1. Dispatch a review that did not write the code. Scope: the 20 modules in
   `rig/catalog/baseline/`, `scripts/build-public-archive.js`, and
   `rig/catalog/baseline/assets/potion-base-2m/model.json`.
2. Report only — the reviewer proposes nothing and edits nothing.
3. Triage findings yourself. Fix at the **common cause**, not per symptom; the
   modules share seams (`run-journal`, `memory`, `release-evidence`).
4. Rerun the lane and the repository gate after each fix batch.

One class of finding has already been found and fixed, so look for its
siblings: free text reaching generated source. `run-journal.rootCause()` used
to interpolate a caller-supplied `symptom` string into a generated source file.
It now rejects any symptom containing a control character and never
interpolates the raw text. Grep the other modules for the same shape — template
literals that build code, shell strings, or file paths from caller input.

**Exit:** a written findings list, each item fixed, waived with a reason, or
raised to the owner; lane and gate green on the bytes after the fixes.

### Phase B — Honest-gap and documentation corrections (no owner decision needed)

Five documents make claims that are no longer true. Three of them are signed
and must not be edited — record the correction for the owner's next re-sign
session instead, in a reasoning trace.

| Document | Signed? | Action |
|---|---|---|
| `15-gate1-contract.md` ("cannot yet sign this programme"; "no signature performed") | Yes | Record only |
| `16-test-manifest.md` ("reviewable, not signable"; status proposed) | Yes | Record only |
| `17-customer-lifecycle.md` (names `tests/ai-sdlc-journeys.test.js`, which does not exist) | Yes | Record only |
| `wiki/specs/ai-sdlc-harness/README.md` ("implementation remains paused") | No | **Correct it** |
| `wiki/specs/ai-sdlc-harness/12-reuse-plan.md` (Transformers.js/MiniLM; Claude-Mem, Hermes, DeepAgents source ports) | No | **Correct it** — potion-base-2M was selected; no port landed |
| `wiki/specs/ai-sdlc-harness/19-work-packages-and-public-roadmap.md` | No | Already updated with a Delivery status section |

Also ship the MIT licence text for potion-base-2M alongside the assets.
Today the licence is only a field in `model.json`; North star 18 and 20 both
require the shipped artifact to carry its licence.

**Exit:** no unsigned document contradicts the branch; a reasoning trace lists
the three signed-document corrections for the owner.

### Phase C — Owner decisions (ANSWERED 2026-10-24; no longer blocking)

All four were put to the owner and answered. Do not re-ask any of them. The
reasoning is in `wiki/reasoning/2026-10-24-human-authentication-owner-decision.md`
and `wiki/reasoning/2026-10-24-ship-the-kit-agent-decides-owner-decision.md`,
and the rulings are locked as North star items 24, 25 and 26.

#### C1 — Hardware signing: **the signed criterion is wrong and needs amendment**

The owner will not buy a USB security key, and does not have to. The
requirement was never FIDO hardware; it is that **an agent cannot perform the
authentication**. `sudo`, a macOS Touch ID prompt and a Windows administrator
prompt all qualify. The owner already signs with an `ecdsa-sha2-nistp256` key
held in Secretive — the macOS Secure Enclave — which prompts for Touch ID on
every signature. That is a genuine per-signature human action.

The signed criterion demands the literal key type `sk-ssh-ed25519@openssh.com`,
so it rejects a setup that satisfies its own intent. This is a **protected
assertion that is wrong**. Rule 1 and rule 2 apply exactly: do not edit the
signed test, do not loosen the harness, do not work around it. Prepare an
unfreeze request using `wiki/gate1/unfreeze-request.template.md` and leave it
for the owner's next signing session.

The amended criterion should accept any key requiring a per-signature human
action the agent cannot supply, naming the Secure Enclave, an administrator or
`sudo` prompt, and FIDO keys for those who own one. **One finding from
2026-09-02 must survive the amendment:** a passphrase on a key file proves
nothing. Ed25519 signatures are deterministic, so signing with and without a
passphrase yields byte-identical output, and an agent holding the key never
sees the passphrase again. Wording that admits "a password-protected key file"
reopens a hole that was tested and closed. The checkable property is that the
key lives where the agent cannot read it and releases a signature only after a
human acts.

Until the owner re-signs, this case stays red on every machine. That is an
honest reported gap, not a defect — keep reporting it as one.

#### C2 — Install scope: **closed, and never ask it again**

Offline search ships. Included, complete, carried with a plain description of
what it does and when it is worth grafting.

The owner's correction is the important part, and it is now North star 25: Rig
is a starter pack thrown at the user's own agent, and **that agent** decides
what to onboard, having read the project and knowing whether an equivalent
already exists. Questions about default-install scope, shipped size, or
per-host coverage are category errors. Do not put them to the owner. Ship
everything, describe it, let the agent graft.

The old open item reading "decide default-install scope" is closed by this:
make sure the capability and its data travel with the kit and are advertised
where a host agent will see them.

#### C3 — Release approval: **authenticate properly, leak nothing**

Publishing must not proceed on a typed name. Three requirements, all shipping
together:

1. Require an authentication the agent cannot perform (C1's rule).
2. Cover both the principal and the key behind it. A name alone is not an
   identity.
3. Write no identity, key material, token or derived secret into any tracked
   file, commit message, or anything that reaches GitHub.

The owner's instruction was "make it complete, don't half-heartedly attempt
anything" — verifying a signature while deferring the secret handling does not
satisfy this. Both halves land together or neither does.

#### C4 — Committing: **do not commit**

The owner said yes and then reversed it in the next message: *"Right now we
don't want to save anything. We just keep it uncommitted until we have done
anything for it."* The reversal governs. **Nothing is committed, nothing is
pushed, nothing is published.** Resumability comes from
`DEPLOYMENT-TRACKER.md` in this directory, which the owner asked for by name;
keep it current instead of relying on git history.

### Phase D — Real-download proof (unblocked; publishing still needs owner authorisation)

This is the single largest honest gap. PT-068 and PT-077 pass today against an
archive built on the same machine seconds earlier. The criteria say *real
download*, and North star 11 makes an automated real-download clean install a
promotion requirement.

1. Add `npm run test:ai-sdlc` to `package.json` running the lane. Do **not**
   add it to `test:code` — North star 21 forbids new acceptance failures
   turning the existing repository CI red, and PT-017 is red by design.
2. Add a workflow job that builds the archive with
   `scripts/build-public-archive.js`, uploads it, downloads it back as a fresh
   artifact, exports `RIG_PUBLIC_ARCHIVE` to the downloaded path, and runs the
   lane. Start it **non-blocking**.
3. The existing `.github/workflows/e2e.yml` downloads a GitHub *source* archive.
   `portability.installArchive` refuses that, correctly, because it has no
   `rig-archive.json` per-file digest manifest. Either point that workflow at
   the built release artifact or leave it alone and keep the new job separate.
   Do not loosen `installArchive`.
4. Extend the OS matrix to every platform AC-077 claims: darwin, linux, win32.
   An unverified platform must be removed from the claim, not assumed.

**Exit:** a CI run showing the lane green (modulo PT-017) against an archive
that was downloaded, not built in place, on every claimed platform.

### Phase E — Exact-commit QA evidence chain (needs C1's amendment signed)

Follow `rig/corpus/standards/change-management.md` and verify with
`node scripts/check-deployment-gate.js --receipt <path>`. Evidence never
carries across a code change: one byte changes, the whole chain is regenerated.

Required on the **exact candidate commit**: full `npm test`; the AI-SDLC lane;
the independent review from Phase A; a security review; the automated health
check; and the real-download clean install from Phase D. Then
`release-evidence.publish()` with authorization satisfying decision 3, and
post-release production validation.

**Exit:** a complete receipt set whose commit digest matches the candidate
byte-for-byte, and a written rollback path.

## 5. Failure loop — what to do when something goes red

Run this until the gates are green. Do not skip the first step; a flake looked
for twice is cheaper than a wrong fix.

1. Reproduce the failure exactly, with the full command and the full output.
   Record both verbatim.
2. Dispatch a **Sonnet** investigator with the reproduction. Its job is the
   root cause, not a patch. Require it to name the shared seam if there is one.
3. If Sonnet cannot localise it, escalate to **Opus** for diagnosis only.
4. Hand the diagnosis to **Haiku** workers to apply, one file each.
5. Rerun the focused test, then every test that covers the touched seam, then
   the full gate.
6. Record the cycle in a reasoning trace before starting the next one.

Never fix a symptom in two places. If two tests fail for the same reason, the
fix goes in the shared code once.

## 6. Things already learned the hard way

- `node --test tests/ai-sdlc/` (directory form) silently reports 1 test. Always
  use the explicit glob `tests/ai-sdlc/*.test.js`.
- `node -I` is not a valid Node flag.
- A leftover developer-scope record in the shared `~/.rig/memory` store once
  outranked the correct project record and broke PT-078. `memory.js` now sorts
  project-scope hits ahead of developer-scope hits; when debugging recall,
  check whether `$RIG_HOME`/`~/.rig` holds state from an earlier run.
- Adding files under `rig/catalog/baseline/` cannot break the existing gate —
  this was probed (254/254 plus three structural checks, exit 0). Removing a
  module returns the lane to its preimplementation red and leaves the gate
  green. That is your rollback.
- A session can die on a rate limit mid-task. Write state to disk continuously;
  the three-minute cadence exists for this.

## 7. Authorization boundary — read before you commit

Nothing in this delivery has been committed. The brief under which it was built
permits no push, no pull request, no published release, no GitHub issue change
and no production change without **separate explicit authorization**. Local
commits were not authorized either and have not been made.

Phase C is answered, so A through D are open work. Phase E cannot complete
until the owner signs the amendment from C1 and separately authorises a
publish. When you reach a point where only an owner-authorised action remains,
stop and report — do not take it.

## 8. What to report when you stop

- Packages completed, with their evidence paths.
- Exact test totals for the lane (with and without the archive) and the
  repository gate, as counts, not adjectives.
- Every unresolved blocker, with who owns it.
- The single next authorized action.
