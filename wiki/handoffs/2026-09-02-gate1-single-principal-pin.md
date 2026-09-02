# Handoff — Gate 1 single-principal pin, forgery fix, and the superpowers cleanup

**Branch:** `path-b-adaptive-onboarding-oracle` · nothing committed · nothing
re-signed · `node scripts/check-advanced-spec.js` **green** (14 files, 83 cases,
`principal=gate1-owner fingerprint=SHA256:MYPMlpxH/cY5SGPoD2ghrL48SLoU5thTvRfViN8gdA4`).

Read `wiki/topics/gate1-signing.md` first, then the two traces this supersedes
the framing of:
`reasoning/2026-09-02-gate1-multi-principal-forgery.md` (the demonstrated
forgery) and `reasoning/2026-09-02-gate1-human-presence-what-is-checkable.md`
(what "a human must sign" can actually be verified).

---

## 1. The actual defect

`verifySignature` in `scripts/check-advanced-spec.js` reads **every** principal
line out of `wiki/gate1/gate1.allowed-signers` and loops, returning success on
the first that verifies:

```js
const principals = signerPrincipals(allowedText);
for (const principal of principals) {
  const result = spawnSync('ssh-keygen', ['-Y', 'verify', '-f', allowed, '-I', principal, ...]);
  if (result.status === 0) { return { armed: true, principal, fingerprint }; }
}
```

It never asserts *which* principal signed. Reproduced end to end in a temp repo:
an agent generates its own key, **appends** `rig-bot namespaces="rig-gate1" <its
pubkey>` (leaving the owner's line untouched), rewrites `acceptance.md` to move
its own goalpost, signs the new oracle message with its own key, and the checker
prints **`Gate 1 protected: principal=rig-bot`** and exits 0.

The original "the ceremony eats my comment lines" report is a symptom of the same
root mistake: treating a one-key pin as a hand-maintained register.

---

## 2. Already done in the working tree — do not redo

- **Roster removed.** The five-line `# key-class:` block is stripped from
  `wiki/gate1/gate1.allowed-signers`; it is now exactly one generated pin line.
  The oracle **still verifies without a re-sign**, which confirms the file is
  outside the freeze digest (`oracleMessage` covers only `business-spec.md`,
  `acceptance.md`, and `testing-infrastructure.manifest`). Provenance was not
  lost — it already lives in the "Standing" section of the signing hub, and the
  fingerprint is independently recorded in git history and several traces.
- **Superpowers cleanup.** `.superpowers/` is in `.gitignore` and
  `.superpowers/sdd/2026-09-01-path-b-remediation/task-1-report.md` is untracked
  (`git ls-files .superpowers/` is empty). Nothing further to do; it just needs
  committing with the rest.
- **Tests rewritten** in `tests/gate1-approval-script.test.js` — 9 tests, **7
  green, 2 red by design**. This file is *not* in the frozen manifest, so editing
  it is free.

---

## 3. What is left — the two red tests

Run: `node --test tests/gate1-approval-script.test.js`

### 3a. `a second principal line cannot ratify a forged oracle` — RED

Fix `verifySignature` in `scripts/check-advanced-spec.js` to require **exactly
one** principal, and fail loud with a message matching `/one principal|single
principal|exactly one/i` when there is more than one. Then verify against that
single principal instead of looping.

> **Constraint — make this structural, never name-based.** The frozen test
> `AT-GATE-2` (`tests/advanced-spec-gate.test.js:58-70`) signs with a principal
> literally named **`owner`** and asserts `verified.principal === 'owner'`. A rule
> like `principal === 'gate1-owner'` breaks a frozen test and forces a second
> unfreeze for zero security gain. "Exactly one principal" already closes the
> forgery completely, whatever the principal is called.

> **Constraint — this file is frozen.** `scripts/check-advanced-spec.js` is
> listed in `wiki/gate1/testing-infrastructure.manifest` (digest `2980d274…`).
> Editing it changes the manifest digest, which changes `oracleMessage`, which
> invalidates `gate1.sig`. See §4 for the required ceremony. **Do not edit it
> without doing §4** — an agent silently re-signing around a frozen file is the
> exact failure the gate exists to prevent.

### 3b. `an unexpected non-owner principal line is not silently dropped` — RED

In `approveGate1()` (`scripts/approve-gate1.js`), before the final
`writeFileSync` of `gate1.allowed-signers`: if the existing file contains any
principal other than `gate1-owner`, throw rather than overwrite. Error text must
match `/unexpected principal|non-owner principal|intruder/i`.

Here the `gate1-owner` name *is* correct — this is the ceremony, which owns that
constant (`PRINCIPAL`), not the verifier. `scripts/approve-gate1.js` is **not**
frozen, so this half costs nothing.

Keep the existing single-line generated write as-is. The green test
`re-signing regenerates the signers file as a single pinned principal line`
already locks that behaviour in; it passes against current code because the
ceremony always wrote a one-line template. **No code change is needed to "make
the file generated" — that was always true.**

---

## 4. The unfreeze ceremony, required only for 3a

1. Copy `wiki/gate1/unfreeze-request.template.md` to
   `wiki/gate1/unfreeze-requests/2026-09-02-single-principal-verifier.md` and
   fill every field. The evidence path to tick is **"the encoded specification
   changed"** — quote the demonstrated forgery from
   `reasoning/2026-09-02-gate1-multi-principal-forgery.md`.
2. The **owner** makes the edit and runs the ceremony. An agent may draft the
   request and the patch; it may not sign.
3. `node scripts/approve-gate1.js` will refuse the first time and print the exact
   digest. Re-run as
   `node scripts/approve-gate1.js --confirm-digest-delta <printed digest>`.
4. Confirm `node scripts/check-advanced-spec.js` is green afterwards.

---

## 5. Owner decision, not the implementer's — FIDO presence

The owner's goal is that only a key requiring a human password or touch can arm
the gate. Two tested facts govern this:

- **A passphrase is unverifiable.** Signing the same message before and after
  `ssh-keygen -p -N 'hunter2'` produced **byte-identical** signatures — ed25519
  is deterministic, and a passphrase only protects the key at rest. The current
  Ubuntu key therefore carries no machine-checkable proof a human was present.
- **FIDO presence *is* enforceable**, via the `verify-required` option on the pin
  line, which OpenSSH honours only for `ecdsa-sk` / `ed25519-sk` keys. Against
  the current plain `ssh-ed25519` key it fails closed (`invalid key`, exit 255).

Note the irony worth preserving: `gate1.allowed-signers` — the file the owner
asked to delete — is the *only* place OpenSSH lets you express "a human must be
verified to sign." Keeping it as a one-line generated pin keeps that option open.

**If the owner adopts FIDO:** enroll `ssh-keygen -t ed25519-sk`, add
`verify-required` to the pin line, re-sign. Cost: the current Ubuntu key stops
working immediately. This is a data change to a non-frozen file — no code change,
no unfreeze. **Do not do this without the owner's explicit go-ahead**; it locks
them out of signing from any machine without the token.

---

## 6. READ THIS BEFORE CLAIMING THE GATE IS FIXED

**The work in §3 does not make the gate unforgeable, and must not be described as
if it does.** An earlier draft of this handoff buried that in a footnote; it is
the headline.

The single-principal rule closes the *append* variant. It does **not** close the
*replace* variant, which is easier. Reproduced:

```
owner armed  : SHA256:zXN62edy7RYuuP9rt6EFWRWTM0SkK+5ucyplfCQomHs
after replace: SHA256:dB+80gdj/vaRedNqVmy1ddGqye/71Ju61SL9S7tp5Y0 | principals: 1
acceptance now: # acceptance: REWRITTEN by the agent
```

The agent overwrites `gate1.allowed-signers` with a single line carrying its own
key — keeping the principal name `gate1-owner` — rewrites the acceptance
criteria, and re-signs. Exactly one principal, so §3a never fires. The verifier
prints `Gate 1 protected: principal=gate1-owner`. The only difference anywhere is
the fingerprint string.

**This cannot be fixed inside the repository.** Every input the verifier consults
lives in the repo, so an actor with repo write access rewrites all of them
consistently. More in-repo checks just add more files to the same commit. The
anchor has to live where the agent cannot write.

Checked, and currently all absent: CI does not compare the fingerprint (no
`gate1` or `check-advanced-spec` reference in `.github/workflows/`), commits are
unsigned (`git log --show-signature -1` → `N`), and nothing outside the repo
records the expected fingerprint in a form any check consults.

**Resolved 2026-09-02 — the anchor now exists, but is not yet armed.** The owner
chose the CI-side pin. `.github/workflows/gate1-pin.yml` +
`.github/scripts/verify-gate1-pin.sh` verify the gate from the *base branch*,
using no repository code, against a repository secret. Five real forgery attempts
were run at it and all are blocked. Details and the attack table:
`reasoning/2026-09-02-gate1-ci-pin-anchor-implemented.md`.

**Two GitHub-side steps remain, and only the owner can do them. Until both are
done the anchor blocks nothing:**

1. Create repository secret `GATE1_FINGERPRINT` =
   `SHA256:MYPMlpxH/cY5SGPoD2ghrL48SLoU5thTvRfViN8gdA4`.
2. Branch protection on `prod`: add `gate1-pin` as a **required** status check,
   and forbid direct pushes. A required check that never reports blocks a merge;
   an unrequired one that never reports is ignored.

Also note the bootstrap gap: `pull_request_target` reads the workflow from the
base branch, so this protects nothing until it is merged to `prod` — the PR
introducing it is not covered by it.

**Do not close out the Gate 1 work claiming forgery is solved** until 1 and 2 are
confirmed done. Local `node scripts/check-advanced-spec.js` remains forgeable by
design; the anchor exists at the merge boundary only.

What §3 legitimately buys: the append variant goes from a silent pass to a loud
failure, and tampering is forced to change the fingerprint — an audit trail, and
by this project's own rule (`wiki/index/rejected.md`) an audit trail is a
deterrent, not protection. Say it that way in the commit message.

---

## 7. Definition of done

- [ ] Both red tests green: `node --test tests/gate1-approval-script.test.js` → 9 pass.
- [ ] Unfreeze request filed and the oracle re-signed by the owner (§4).
- [ ] `node scripts/check-advanced-spec.js` green.
- [ ] `npm test` shows **no failures other than the four pre-existing ones**
      below. It cannot be fully green — see the note.
- [ ] Committed together: the gitignore/superpowers cleanup and the Gate 1 fix.
- [ ] `wiki/topics/gate1-signing.md` "Known defect" block moved to fixed, and
      this handoff deleted.
- [ ] The close-out does **not** claim forgery is solved (§6). The trust-anchor
      decision is separately open and belongs to the owner.

### The suite is already red at HEAD — four failures are not yours

Measured on a clean worktree at `36e6a8f`, with none of this work applied:

```
not ok - AT-LF-11 a read-only check that mutates halts with preserved evidence
not ok - AT-LF-12 autofix is separately approved and rechecked without committing
not ok - AT-LF-23 a task exceeding its resource or time cap is killed and reported
not ok - lint grade evidence comes from spawned argv and cannot fake a clean exit
```

The first three live in `tests/advanced-oracle.test.js`, which **is** in the
frozen manifest — so these are frozen acceptance cases the implementation does
not currently satisfy. That is a separate defect from anything in this handoff
and is not in scope here, but it means `CLAUDE.md`'s "run the full gate and
confirm it is green before pushing" cannot be satisfied as written. Compare
against the four above rather than against zero, and do not "fix" them by
editing the frozen file — that needs its own unfreeze request.

Full run with this work applied: 700 tests, 694 pass, 6 fail — the four above
plus the two intentionally red ones from §3.

(One oddity, noted not chased: `AT-HOME-1` fails when
`tests/advanced-oracle.test.js` is run alone but passes in the full run, so it
appears order- or fixture-dependent.)
