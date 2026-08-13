# Roadmap — from here to a shipped product

> **This file is a map, not a rulebook.** It tells you what order to do things
> in. It does not decide anything. The two documents that actually decide things
> are [`current/acceptance.md`](current/acceptance.md) and
> [`current/spec/technical-spec.md`](current/spec/technical-spec.md). If this
> file ever disagrees with either of them, **they are right and this file is
> wrong** — go fix this file. Never do something because this file said so.

Checked against the actual files on **2026-08-13**. Commit `06c3f8f`.

---

## The short version

You are **one document away from being able to start building.**

The requirements are finished and correct — 52 numbered checks that define what
"working" means. The build plan is out of date: it was written when there were
only 45 checks, and it has never described the seven that were added on July 28.
Until it does, no code can be written, because the project's own rules refuse to
let building start against an out-of-date plan.

So: **rewrite the build plan, get it reviewed, sign the requirements, and you're
into construction.** Everything after that is long but straightforward.

---

## Words this document uses

The project's own files use shorthand. Here is what it means in plain terms.

| Shorthand | What it actually means |
|---|---|
| **Gate 1** | The requirements. Two files: `business-spec.md` (what we're building and why) and `acceptance.md` (the 52 checks that prove it works). **Finished and locked.** |
| **Gate 2** | The build plan: `technical-spec.md`. How the thing gets built. **Out of date — this is the current job.** |
| **The 52 checks** | Numbered items like `AT-UNINSTALL-1`. Each one is a specific, testable statement about what the product must do. Nothing ships until every one of them has a real test that passes. |
| **A "slice"** | One chunk of the build. There are 14 planned, done in order, each one ending in working code. |
| **A digest / fingerprint** | A SHA-256 hash of a file. Used to prove a document hasn't changed since someone approved it. |
| **"Armed"** | Whether the signature check is switched on. Right now it is **off**, because the file that switches it on doesn't exist yet. |
| **A "first wire"** | One real, working, end-to-end connection to a specific host or CI provider — not a description of one. |
| **Verified vs emitted** | Every supported host gets files generated for it (*emitted*). Only the ones with a proven working connection get advertised as *verified*. Shipping something as "emitted, not verified" is honest and allowed. |

---

## Where you are

```
  STAGE 1        STAGE 2      STAGE 3       STAGE 4       STAGE 5
  Finish the  →  Build it  →  Prove it's →  Make it    →  Call it
  plan                        done          installable   supported

  ▲
  YOU ARE HERE
  Step 1 of 8
```

| # | Step | Stage | Status |
|---|---|---|---|
| **1** | **Rewrite the build plan to cover all 52 checks** | 1 | ⬅ **do this next** |
| 2 | Get the plan reviewed by a different AI model | 1 | waiting on step 1 |
| 3 | Sign the requirements with a hardware key | 1 | **you can do this today, in parallel** |
| 4 | Mark the plan final; refresh the supporting docs | 1 | waiting on 1–3 |
| 5 | Build the product, chunk by chunk | 2 | blocked until stage 1 ends |
| 6 | Pass the eight release checks | 3 | — |
| 7 | Build and test the installer | 4 | — |
| 8 | Announce what's supported | 5 | your call |

Steps 1, 2 and 4 are things an agent does. **Step 3 is yours alone** and nobody
can do it for you. Step 8 is a business decision, also yours.

---

## What is actually true right now

Not copied from another document — each line was checked against the files today.

| Thing | State |
|---|---|
| Requirements (`acceptance.md`) | **Done.** 52 checks, frozen. Amended 2026-08-13 by D19, which changed a mechanism, not a verdict — still 52. |
| Build plan (`technical-spec.md`) | **Rewritten 2026-08-13.** Covers all 52. Still a *candidate*: §16.1 lists what must hold before it can be frozen. |
| The seven that had been missing | `AT-BASE-7`, `AT-INSTALL-1`, `AT-REPORT-1`, `AT-SECRET-1`, `AT-UNINSTALL-1`, `AT-UNINSTALL-2`, `AT-UNINSTALL-3` — all now have mechanisms and traceability rows. |
| The plan's record of which requirements it was written against | **Correct.** Re-pinned to `604e80bd…` and `ee9f80b9…`, checked equal to the live files. |
| Signature protection on the requirements | **Off.** Neither `gate1.sig` nor `gate1.allowed-signers` exists. This is step 3, and it is yours. |
| Past reviews of the build plan | **Both expired.** They were reviews of older versions; the plan has changed since. A fresh review is step 2. |
| The automated check that enforces all this | **Doesn't exist yet.** `scripts/check-advanced-spec.js` has never been written. It's the first thing step 5 builds. |
| A way for anyone to install the product | **Doesn't exist.** No `install.sh`. Version still says `4.8.4`. |
| The review tool | **Exists and works** — `scripts/review-receipt.js`. |

To re-check the fingerprints yourself at any time:

```sh
shasum -a 256 project-dev-docs/current/spec/business-spec.md \
              project-dev-docs/current/acceptance.md \
              project-dev-docs/current/spec/technical-spec.md
```

⚠️ **One thing that looks like progress and isn't.** There is a file called
`scripts/uninstall.js`. It is leftover from an older, unrelated plugin — it
deletes a config file and a status-line entry. It has nothing to do with the
uninstall feature the requirements describe. Don't treat it as a head start.

---

# Stage 1 — Finish the plan

Four steps. None of them require any code to be written. All four are about
getting one document correct and provably approved.

## Step 1 — Rewrite the build plan to cover all 52 checks

**Who:** an agent, working in the product-design phase.

**What happened:** on July 28 a review session added seven new requirements.
They cover things the build plan has genuinely never described — most notably,
**how to uninstall the product**, which was not previously a feature at all.

**Why this isn't just a table update:** each new requirement needs a real
mechanism designed for it, and one of them *contradicts* something already in
the plan. You cannot renumber your way out of that.

Here's what each of the seven needs:

| New requirement | What the plan must now describe |
|---|---|
| `AT-UNINSTALL-1` | How to remove the product: walk the install record backwards, delete the files we own outright, surgically cut our blocks out of files we only edited, remove things in an order that never leaves a dangling reference, and report what was removed. |
| `AT-UNINSTALL-2` | We keep copies of files as they were before we touched them — but **only as evidence**. We never restore them automatically. Uninstall either verifies it left a clean tree, or names exactly what it couldn't clean. |
| `AT-UNINSTALL-3` | Things the user generated while using the product survive uninstall by default. A `--purge` flag deletes them, and it must say what it's about to delete first. |
| `AT-INSTALL-1` | If an install is interrupted, it can be resumed. The install record tracks how far it got. A half-finished install claims to have installed *nothing*. |
| `AT-REPORT-1` | Scan reports stay on the user's machine. Not committed, not uploaded, **and no finding details in CI logs either**. |
| `AT-SECRET-1` | Secret detection runs deterministically — no AI in the loop. Counts, rule IDs and file locations can go to the model; the matched text never does, unless the user explicitly opts in. |
| `AT-BASE-7` | The product can't turn its own protections on for itself. This is a hard-coded product rule, not something the user can edit out of a policy file. |

**Three knock-on effects that are easy to miss:**

- **The install path changes, even though its requirement ID didn't.** Uninstall
  can't remove what nobody wrote down. So markers and install-record entries now
  have to be written *at the moment each change is made*, not reconstructed later.
- **Chunk 10 currently contradicts the requirements.** It says CI uploads reports.
  `AT-REPORT-1` says it doesn't. CI now emits a verdict plus counts only. That
  chunk needs rewriting, not renumbering.
- **A receipt in `AT-BASE-4` disappears.** Permission to edit policy is now
  session-only and nothing is written down — which means a later session claiming
  it had permission can't possibly prove it, so it's refused.

Also, while you're in there: update the fingerprints in the plan's header to
match the live requirements files. Do it **as part of** the rewrite, never
before — updating a fingerprint on a document you haven't fixed yet is worse
than leaving it visibly wrong.

> 🎯 **Done when:** the build plan describes a mechanism for all 52 checks, its
> traceability table lists all 52 IDs with no extras and no gaps, chunk 10 no
> longer contradicts `AT-REPORT-1`, and the header fingerprints match the files
> on disk.

## Step 2 — Get the plan reviewed by a different AI model

**Who:** an agent, using the existing tool.

A model can't review its own work meaningfully, so the review has to be run by a
different one. The tool enforces this — it refuses to run under the model named
in the plan's header.

```sh
node scripts/review-receipt.js \
  --target project-dev-docs/current/spec/technical-spec.md \
  --gate1 project-dev-docs/current/spec/business-spec.md,project-dev-docs/current/acceptance.md \
  --model <any model other than the one that wrote the plan> \
  --out project-dev-docs/current/reviews/gate2-v0.4-round1.review.json
```

Takes several minutes — run it in the background.

**Expect to do this more than once.** If the review finds something and you fix
it, the document changes, its fingerprint changes, and the review you just got
no longer applies to the document you now have. That's the mechanism working
correctly, not a bug. Budget for two or three rounds.

The two review files already sitting in `current/reviews/` are history. They
describe older versions. They don't count toward anything.

> 🎯 **Done when:** a review comes back with zero blocking findings and an empty
> unresolved list, recorded against the exact fingerprint of the current plan.

## Step 3 — Sign the requirements with a key an agent can't use

**Who: you, and only you.** This is the one step that cannot be delegated —
delegating it would defeat its entire purpose.

**The problem this solves:** an agent editing the requirements to make its own
work easier. A signature the agent can't produce is the only thing that actually
stops that. If the signing key sits on disk unprotected, an agent that can read
the disk re-signs its own edits and the protection is theatre.

**This step changed on 2026-08-13 (decision D19).** It used to demand a FIDO
security key. That turned out to be asking for something no SSH signature
provides: `ssh-keygen` records hardware attestation only when a key is created,
its verify mode has no option that looks at it, and the allowed-signers file
cannot express a touch requirement at all. Verification proves the signature is
sound and the key is on your list — nothing about the hardware. So a FIDO key
would have bought a convention, not a proof, and the requirement is now the
property that actually matters: **a key no agent on this Mac can sign with
unless a human does something live.** Your Touch ID satisfies that, free, today.

**Right now the check is switched off.** There's no list of authorised signers,
so the system runs in "unarmed" mode where a missing signature isn't a failure.
Three things to do — get a key, switch the check on, then sign.

**Build the message yourself.** Every command below runs in *your* shell, not an
agent's. That is not ceremony: `ssh-keygen` signs exactly the bytes it is handed
and has no idea they are supposed to be hashes of two particular files. If you
sign a message an agent prepared, you have signed whatever that agent put in it,
with a perfectly valid signature. Never sign a message file you did not just
generate from the files you are approving.

```sh
# 0. One-time: a key that lives in this Mac's secure element and needs your
#    fingerprint for every single signature. The private half never exists as
#    a file, so nothing on disk can be stolen or reused by an agent.
#    Name it something dedicated, e.g. "Winmore Rig Gate 1 Signing", and use it
#    for nothing else — not GitHub, not servers, not git commit signing.
brew install --cask secretive
#    Then in Secretive: create the key, tick "Authenticate before use", copy its
#    public key, and export the SSH_AUTH_SOCK line the app shows you.
ssh-add -l                      # your new key should be listed

# 1. Switch the check on. This file holds your PUBLIC key only, and it is the
#    whole of what the gate trusts — see the warning below.
KEY="$(pbpaste | awk '{print $1" "$2}')"        # keytype + key data, no comment
{
  printf '# key class attested by the intent owner: Secure Enclave, biometric per signature\n'
  printf '%s namespaces="rig-gate1" %s\n' "vaibhav.kodiyan@winmore.io" "$KEY"
} > project-dev-docs/current/gate1.allowed-signers

# 2. Build the message FROM THE FILES, read it, then sign it.
{
  printf 'rig-gate1-freeze-v1\n'
  printf 'business-spec.md %s\n' \
    "$(shasum -a 256 project-dev-docs/current/spec/business-spec.md | awk '{print $1}')"
  printf 'acceptance.md %s\n' \
    "$(shasum -a 256 project-dev-docs/current/acceptance.md         | awk '{print $1}')"
} > /tmp/gate1.msg
cat /tmp/gate1.msg              # read it. three lines. then sign, immediately.

#    Signing goes through the agent, so -f takes the PUBLIC key.
ssh-keygen -Y sign -f <your-public-key>.pub -n rig-gate1 /tmp/gate1.msg   # Touch ID prompts here
mv /tmp/gate1.msg.sig project-dev-docs/current/gate1.sig

# 3. Confirm it verifies, and record your fingerprint somewhere off this Mac.
ssh-keygen -Y verify -f project-dev-docs/current/gate1.allowed-signers \
  -I vaibhav.kodiyan@winmore.io -n rig-gate1 \
  -s project-dev-docs/current/gate1.sig < /tmp/gate1.msg
ssh-keygen -lf <your-public-key>.pub    # save this fingerprint in your password manager
```

Note the file paths in step 2: `business-spec.md` lives under `current/spec/`,
`acceptance.md` directly under `current/`. They are not in the same directory,
and a command that gets that wrong silently produces an empty digest.

Three things not to do. Don't put `verify-required` or `no-touch-required` in
the signers file — they are not valid there and `ssh-keygen` will reject the
file. Don't sign with a plain `~/.ssh/id_ed25519`: nothing will stop you, and
nothing will protect you either. And don't reuse this key for anything else; a
dedicated key keeps the blast radius of any mistake to this one gate.

A hardware key still works and still satisfies this, if you buy one later. The
signers file is the only thing that would change.

### What this does not protect against, and what to watch

`gate1.allowed-signers` is the trust root, and it lives in the repository it
protects. An agent that can write the repo can replace your key with its own,
re-sign its own edits, and the verify command will happily print
`Good "rig-gate1" signature`. The principal string is just a label; it proves
nothing about you. Nothing cryptographic fixes this from inside the repository,
and the git-based fixes — protected branches, code owners, reviewed commits —
are the ones you rejected in GA-11 for charging every requirements edit to
commit history.

What we do instead, and why it is worth the little it costs: the gate will print
the fingerprint of the key it verified against on **every** run. You will know
your own fingerprint — that is what step 3 saves to your password manager. A
swapped trust root then shows up in ordinary output every time you run the
tests, rather than waiting for someone to read a diff. That turns a silent
substitution into a loud one. It does not make it impossible, and this file
should never claim it does.

The `namespaces="rig-gate1"` restriction in your signer line is the other cheap
guard: it scopes the key's authority to this one use, so a signature you made
for some other purpose can never be replayed here.

### If you lose the key

Secure Enclave keys cannot be backed up or moved to another Mac — that is the
same non-exportability that makes them worth using. New laptop, logic-board
repair, or a wiped machine means the old key is gone for good.

This is smaller than it sounds. Verifying **old** signatures needs only the
public key, which is committed, so nothing already signed becomes unverifiable.
What you lose is the ability to sign the *next* change, and recovering is four
commands: create a new key in Secretive, replace the line in
`gate1.allowed-signers`, re-run step 2 against the current files, commit both.
There is no revocation list and no key ceremony, because there is one signer and
that file is the entire trust store. Do the same on suspected compromise or if
the key ever leaves your sole control.

**Timing:** this step doesn't depend on steps 1 or 2. Do it today if you like.
The only downside of signing early: if the rewrite in step 1 turns up a genuine
gap in the requirements, the requirements change, and you sign again. Signing
early costs a possible second signature. Signing late costs a wait.

Since the requirements changed on 2026-08-13, the fingerprints have moved. The
commands above recompute them, so nothing here goes stale — but a signature made
before that date would no longer verify.

> 🎯 **Done when:** the `verify` command above prints
> `Good "rig-gate1" signature`, and both new files are committed.

## Step 4 — Mark the plan final and refresh the supporting docs

**Who:** an agent.

Flip the plan's status to FROZEN, pin the fingerprint that was reviewed, and
update `current/README.md` and `handoff.md` to say the plan is final.

**Then, before any building starts,** bring `sow.md` and `tasklist.md` up to
date. They were last updated for an earlier decision and still describe a world
with no uninstall feature, no install record, and the old permission model.
They can't override the build plan — but the automated check reads them looking
for contradictions, so leaving them stale turns documentation debt into a hard
build failure on day one.

> 🎯 **Done when:** the plan says FROZEN, the requirements have a verifying
> signature, and `sow.md` and `tasklist.md` describe the same product the plan
> does. **Building may now begin.**

---

# Stage 2 — Build it

## Step 5 — Build the product, chunk by chunk

**Who:** an agent, one chunk at a time, in order.

Fourteen chunks are planned. Each ends in working, tested code. The list below
is the current plan **plus** where the seven new requirements most likely land —
those placements are a guess, and step 1 is what settles them. When step 1
lands, re-derive this table from the plan and delete the guesses.

| # | Chunk | What the July 28 changes add to it |
|---|---|---|
| 1 | The automated plan check + all 52 tests wired up | Signature check runs first, before anything else; 52 tests, not 45; on/off behaviour when unarmed |
| 2 | Catalogue structure and content gate | — |
| 3 | Policy reading, active configuration, honest status output | The self-activation ban becomes a hard product rule |
| 4 | User-presence and one-time approvals | Permission-to-edit is now session-only; no receipt written |
| 5 | Cross-surface evaluation and onboarding | — |
| 6 | Real cleanup actions and safe transactions | Install record + markers written at every single change; resumable installs |
| 7 | Git and CI controls, evidence tracking | Deterministic secret detection |
| 8 | Service runner and history activation | Reports stay local; secret triage is opt-in only |
| 9 | Host contracts, claim status, first real connections | — |
| 10 | Six CI providers | **Report upload removed.** Verdict and counts only. |
| 11 | User-global file writes and disclosure | Feeds into the uninstall path |
| — | **NEW: uninstall from a repository** | `AT-UNINSTALL-1/2/3`. **No existing chunk covers this at all** — reverse walk of the install record, surgical block removal, evidence comparison, purge flag. |
| 12 | Installer and distribution | — |
| 13 | Write all 115 service packs | — |
| 14 | Full matrix, fresh review, regression sweep | 52 tests |

**Two things about this stage that will surprise you if nobody warns you:**

**`npm test` will be red for the entire stage. On purpose.** The plan check runs
first and stops the whole suite the moment it finds an unmet condition — and
conditions stay unmet until chunk 14. Your day-to-day signal is
`npm run test:code`, which should be green continuously. Feature branches may be
pushed with `npm test` red. **Nothing merges to `prod` while it is red.**

**Chunk 13 is the longest and cannot be parallelised.** All 115 service packs get
written one at a time, in a single context. Not batched by family, not
templated. This is deliberate: the failure this project is recovering from is
432 placeholder files generated in bulk, and writing them one at a time is the
only thing that actually prevents a repeat. The cost is accepted, not optimised.

> 🎯 **Done when:** every one of the 52 checks has a real, executable test that
> genuinely tests it, and `npm run test:code` is green.

---

# Stage 3 — Prove it's done

## Step 6 — Pass the eight release checks

**Who:** an agent. These are properties of the **finished product**, and every
one of them must hold on the same single version of the code.

1. The build plan is the only frozen authority, and points at the current requirements.
2. Its traceability table matches the requirements' ID list exactly — no extras, no gaps — and every row names a real, runnable test.
3. Placeholder and contradiction checks pass, and a fresh review of the exact final version comes back with nothing unresolved.
4. All 115 service packs pass both the mechanical checks and a separate fresh-context review for quality and non-overlap.
5. Every host advertised as *verified* has a documented contract, real evidence, and one passing live connection.
6. All 52 acceptance checks pass.
7. The older test suites still pass.
8. `npm test` passes on that exact same code.

> ⚠️ The plan's own copy of check 2 still says "45". It becomes wrong the moment
> step 1 lands. The real check reads the ID list from the requirements file, so
> the written number is only documentation — but fix it to 52 during step 1
> anyway.

**The thing that makes this achievable:** release blocks on what you *advertise*,
not on everything you *built*. Files are generated for every supported host. Only
the ones with a proven working connection get called "verified". A host shipping
as "generated, not verified" — and honestly labelled as such — does not block
release. Without that split you'd need live credentials for 19 hosts and six CI
providers, which nobody has. That's exactly why an earlier version of this gate
was impossible to satisfy and this one isn't.

> 🎯 **Done when:** all eight hold simultaneously on one commit.

---

# Stage 4 — Make it installable

## Step 7 — Build and test the installer

**Who:** an agent. This is chunk 12, called out separately because it's the step
most likely to get treated as optional. It isn't — a correct product nobody can
install is not a shipped product, and right now there is no way to install this
at all.

- Write a committed `install.sh` at the repo root. It resolves a **release tag by
  name** (default: the latest) *before* downloading anything, and records the
  exact tag it resolved in the install record. "latest" is a lookup, never a
  stored value.
- The installer downloads to a file and then runs that file. It **never pipes the
  network straight into a shell.** Rig's own default policy forbids exactly that,
  and an installer that breaks the product's own rule in its first five seconds
  is indefensible.
- No build fingerprint baked into the installer. The installer and the source
  come from the same place, so anyone who can move a tag can also edit a constant
  next to it. Preventing accidental retagging is a repository setting (tag
  protection), not something the installer can do.
- Delete `.github/workflows/publish.yml`. The package is private, so tagging a
  release would trip a publish step that was never going to succeed.
- Bump the version from `4.8.4` to `5.0.0`. Keep it private.
- No workflow may reference `main` or `master`.

> 🎯 **Done when:** a container with only `git`, `curl` and `sh`, and no copy of
> the repo, installs into an empty repository; running it twice at the same tag
> produces byte-identical results; and tagging `v5.0.0` cannot trigger
> `npm publish`.

---

# Stage 5 — Call it supported

## Step 8 — Announce what's supported

**Who: you.**

The last step is describing the catalogue as supported, scoped honestly to the
hosts that actually carry evidence.

Update cadence, maintenance staffing, commercial ownership and a support process
are **deliberately left out** until there's real usage. The requirements say so
explicitly. They are not prerequisites, and inventing them here would be
inventing scope.

> 🎯 **Done when:** you've decided what "supported" claims, and the claim matches
> the evidence.

---

## The three things only you can do

Everything else can proceed without you.

1. **Sign the requirements** (step 3). Not delegable — that's the whole point.
2. **Rule on anything the rewrite turns up.** If step 1 finds a genuine gap in
   what the product is supposed to do, it comes back to you rather than getting
   quietly absorbed into the design. That's the process working. The
   hardware-key requirement itself came out of exactly this happening once
   already.
3. **Decide when to advertise** and what "supported" means (step 8).

---

## How long will this take?

**There is no current estimate, and making one up here would be dishonest.**

The original 115–179 person-day figure is kept in `sow.md` as a record of how
the first estimate was made, nothing more. A later "18–28 days remaining" figure
is **withdrawn** — it left out the catalogue rewrite, the policy and approval
system, and the live-connection work entirely.

`sow.md` explicitly says no replacement gets assigned until the build plan is
final. That's still true, and the scope has grown since — Stage 2 has picked up
an entire uninstall feature that no chunk covered.

**The estimate belongs at the end of step 1**, derived from the rewritten chunk
list. Ask for it then.

---

## Traps that have already cost this project time

These apply at every stage. All of them have bitten before.

- **The default branch is `prod`, not `main`.** `origin/main` doesn't exist. The
  workspace metadata says `main` and it is simply wrong.
- **The requirements can't be edited by whoever is designing or building.** If
  building hits a genuine conflict, the work stops and the question goes back to
  a requirements session.
- **`node --test <missing-file>` prints "Could not find" and exits with success.**
  A test entry pointing at a deleted file reads as green. Check every named file
  exists; never trust the overall exit code alone.
- **The current test suite is green and proves nothing.** 238 tests pass while
  432 files still contain `TODO(Slice 10)`. The 19 `tests/advanced-*.test.js`
  files check that files exist and aren't empty — and a file containing the word
  "TODO" is not empty. **They were calibrated to pass against placeholders.** A
  real rewrite should make most of them fail first.
- **Commit `8dcaa49` is mislabelled.** It's titled "Implement Advanced a-la-carte
  catalogue and delivery CLI" but contains the 432 placeholders and code built
  against a design that was later withdrawn. It is not delivered work.
- **A partly-applied protection is never reported as enabled, installed, or
  protecting anything.** This matters most at the exact moment it's most tempting
  to fudge: when an install fails halfway.
- **`rg` is not installed here.** Use `grep -RIn`.
- **Other sessions edit these files.** Re-read before editing; re-check
  fingerprints after.

---

## Keeping this file honest

It goes out of date in three silent ways:

1. **A fingerprint above stops matching.** Recompute them; never copy them
   forward from another document.
2. **The chunk table in step 5 outlives the rewrite.** The moment step 1 lands,
   rebuild that table from the plan and delete the guessed placements — they
   were guesses and shouldn't survive the thing that answers them.
3. **A step finishes and nothing here says so.** Progress is recorded in
   `handoff.md`, which is the live status document. This file is the map, not the
   odometer.

If this file ever contradicts the build plan, fix this file. If deleting it would
lose nothing, delete it.
