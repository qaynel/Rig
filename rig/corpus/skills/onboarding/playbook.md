# Rig onboarding playbook

Rig is installed but not yet adapted. Rig code never decides what this
repository needs; the host agent does, and the user approves the summary before
a repository-owned byte moves.

## Understand

Read the repository's own workflow and identify its existing authorities.

## Discover

Run `rig onboarding` `prepare` to obtain the bounded structural inventory and
overlap hints.

## Catalogue-read

Read `.rig/catalog.json` and select only named capabilities from the pinned
catalogue; never infer a skill from a directory name or prose.

## Delta

Decide, per capability, whether to reuse, graft, add, or omit. Record any
consequential choice as a critical decision for the user.

## Propose

Submit the exact inventory-bound proposal and eight-section summary with
`rig onboarding` `propose`.

## Summarise

Explain the existing state, interpretation, reuse, grafts, new capabilities,
important decisions, resulting pipeline, and expected user experience.

## Apply on approval

After verified approval of the exact proposal, run `rig onboarding` `apply`,
then `check`. Apply changes only through the approved, versioned grafts and
selected skill projections.
