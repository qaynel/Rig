# Unpacking Rig onto this repository

You are the host agent. Rig is one corpus; you graft the smallest useful part of
it onto the repository as it already is. Rig code does not infer what this
repository needs and never decides for you. The human approves one exact
proposal before any repository-owned byte changes. Follow the steps in order.

Rig ships offline meaning-based search over the repository's retained memory,
using bundled local model assets; it works without a network call, provider
account, or first-run model download. Offer it when the repository needs
meaning-based recall across prior decisions or work notes. First inspect whether
the repository already has equivalent search, then let the host agent choose
the smallest useful graft. The lexical search path is a cited fallback if local
semantic inference fails; it does not replace the semantic capability.

## 0. What is already here

The installer put the corpus under `.rig/`: `routing.md`, `rules/`, `skills/`,
`catalog.json`, and this `onboarding/` directory. It also projected the files
the hosts it recognised read natively; the release record (release.json in that directory) lists those hosts.
Nothing in the repository's own configuration was replaced.

## 1. Inspect

Send `{"schema_version":1,"action":"prepare","target":"<repo>"}` to
`rig onboarding --input request.json` from the runtime install (or the
`rig_onboarding` MCP tool). The response holds a bounded structural inventory of the repository's
existing agent configuration, overlap hints, and the pinned catalogue. Read the
repository's own workflow first; its existing authorities stay authoritative.

## 2. Select

Choose the smallest set that closes a real gap, per capability: reuse what the
repository already has, graft a missing guarantee, add a catalogue skill, or
omit. Name only items that exist in the pinned catalogue (catalog.json). Record any consequential
choice as a critical decision for the user instead of making it yourself. Where a
capability needs a service, take it from the staged flow
(`inspect`, `recommend`, `select`, `plan`) and keep the service's grade explicit.

### When to offer a catalogue service

Offer a service when its `identity.md` **Offer** guidance fits the repository's
actual gap and its applicability conditions hold. Compare the service's stated
coverage ceiling with the guarantee the repository needs; do not imply that a
service covers behavior beyond that ceiling. Choose the minimal grade that meets
the need. Use a higher grade only when its additional evidence or checks close a
specific gap. If applicability does not hold, the coverage ceiling is too narrow,
or the repository already has an equivalent guarantee, omit the service and say
why in the proposal summary.

## 3. Project

- **A host Rig has a projector for** is already done by the installer. Do not
  re-create its files by hand; propose only what the repository still lacks.
- **A host Rig has no projector for** (any host the release record does not list
  as projected, or one you were told about by name) follows
  [`unpack.md`](unpack.md): you write a deterministic script, the human approves
  its exact bytes, and Rig runs it in a sandbox.

Third-party skills you select are fetched from the pinned upstream during apply,
verified against their digests, and patched; an unavailable upstream or a bad
digest is a named gap, never a silent success.

## 4. Graft

### Graft a selected service

Add selected service guidance to the repository's existing instruction file
that owns the relevant workflow. Preserve its existing text and place the new
content only inside a marked section. Name the service and selected grade in the
proposal, and show the exact graft for approval before applying it.

Put new guidance into existing instruction files inside marked sections, never
over the user's text:

```md
<!-- rig:graft capability="testing.web-quality-assurance" version="1" begin -->
...your content...
<!-- rig:graft capability="testing.web-quality-assurance" end -->
```

Each graft names the file, the capability, the content digest, and the digest of
the file you read (`preimage_digest`), so a file that changed under you is
refused rather than overwritten.

Offer `.rig/standards/ai-sdlc.md` in the repository's existing agent or
contributing instructions as a managed `development.ai-sdlc` graft. The runtime
helper `standardsGraft(target, path)` builds the exact proposal row, including its
preimage digest; for an installed runtime pass the standards file as `source`.
Do not restate the standards in a second authority. Only offer a rule as enforced
when its checker is installed and invoked in the existing gate; otherwise retain
the document's guidance label. Existing repository docs survive outside markers.

## 5. Propose, approve, apply, check

1. `propose` with the proposal and the eight-section summary. Nothing is written.
2. Show the human the summary. They approve the exact proposal digest with an
   SSH signature (`rig-plan-approval`). You cannot approve for them.
3. `apply` with the signed receipt. Writes go through the install journal, so the
   whole change can be reversed by `rig uninstall`.
4. `check`. It must report no hard failures. Fix what it names and run it again.
5. If any step fails, state the named reason to the user; do not work around it.

## 6. Finish

Tell the user what was added, what was reused, and what was left out and why.
If you wrote a projection script that worked, offer it back as a new projector
(see the last section of `unpack.md`).
