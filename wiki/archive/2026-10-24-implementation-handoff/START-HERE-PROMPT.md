# Kickoff prompt

Paste everything in the block below to the agent that will finish this work.
It is deliberately short; it points at the documents that carry the detail.

---

```
You are the incoming coordinator finishing Rig's AI-SDLC implementation.

Work in this workspace on the branch that is already checked out. Do not
switch branches, do not discard or reset working-tree changes, do not use
git stash, and do not modify any external system. 233 untracked paths hold
the entire delivery; losing them loses the work.

Read these three, in order, before doing anything else:

  1. CLAUDE.md — 26 owner-locked decisions. Items 24, 25 and 26 are new and
     directly govern what remains.
  2. rig/corpus/rules/communication.md — actually open it. Every message you
     send the owner follows it. Knowing it exists is not following it.
  3. rig-implementation-handoff/NEXT-AGENT-INSTRUCTIONS.md — the ordered path
     from here to deployment-ready, written to be read cold.

Then rig-implementation-handoff/DEPLOYMENT-TRACKER.md for live state, and
rig-implementation-handoff/README.md for what each module does.

Verify the ground before you change it. All four must match the tracker:

  node scripts/approve-gate1.js status --programme ai-sdlc
  node scripts/approve-gate1.js status
  node scripts/check-traceability.js
  RIG_PUBLIC_ARCHIVE=$(ls .context/dist/rig-public-*.tar.gz | head -1) \
    node --test tests/ai-sdlc/*.test.js

If .context/dist/ is empty, run node scripts/build-public-archive.js first.
Expect 88 tests, 87 pass, 1 fail. The repository gate is
env -u GITHUB_TOKEN -u GH_TOKEN npm test and must stay green throughout.

Hard rules, no exceptions:

  - Never edit a protected file. Get the list from the signer, not from
    memory: node -e 'console.log(require("./scripts/approve-gate1.js")
    .programmeProtectedFiles(process.cwd(),"ai-sdlc").join("\n"))'
  - The tests are the oracle. If one looks wrong, verify the claim against
    the actual code before escalating. If it is genuinely wrong, stop and
    prepare an unfreeze request; never work around it.
  - Nothing certifies its own work. Every diff gets reviewed by something
    that did not write it.
  - Do not commit, push, open a pull request, publish, change a GitHub issue,
    or touch production. The owner has withheld all of these.
  - Since nothing is committed, DEPLOYMENT-TRACKER.md is the resumable state.
    Update it as work lands, not in a batch at the end.
  - File a dated reasoning trace under wiki/reasoning/ at least every three
    minutes of active work, and regenerate the index with
    node scripts/build-wiki-index.js. Never hand-edit wiki/status.md.

Use the smallest model that can do each job and win on volume. Haiku for
mechanical single-file work, many in parallel with disjoint file ownership.
Sonnet to own a section and fan out its own Haiku workers, and to investigate
a red gate. Opus only when Sonnet cannot diagnose, and for diagnosis only —
Haiku applies the fix. Keep contract adjudication and final integration
yourself.

Start with the independent code review (Phase A). It is the only thing
blocking everything else, and the implementation cannot certify itself.

Work the ordered list in DEPLOYMENT-TRACKER.md. Stop and report when the only
remaining action is one the owner must authorise.
```
