# Rig onboarding playbook

Rig is installed but not yet adapted. Rig code never decides what this
repository needs; the host agent does, and the user approves the summary before
a repository-owned byte moves.

## Understand

Read the repository's own workflow and identify its existing authorities.

## Discover

Run `rig onboarding` `prepare` to obtain the bounded structural inventory and
overlap hints. Prepare applies the active sanitation policy first: resolve a
blocking or quarantined harness verdict before continuing to capability review.

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

## User sign-off

Before the first sensitive action, ask the owner which sign-off mode to use
and record that explicit choice. Do not pick one because a key is missing.

Explain the three modes in plain language: a verified signature, a platform
prompt, and a written acknowledgement. A signature proves the enrolled key
signed the action. Human presence is proven only when the key itself requires
a person, such as a security key. Touch ID on an ordinary key algorithm is
designated, not proven by the signature. A password prompt, `sudo`, or a
cached credential does not prove a person acted. A written acknowledgement is
a declaration the owner may choose; an agent that can write files can forge
it, so it is not independent authorisation.

A release that must be cryptographically signed still needs a signature that
verifies against the single trust root. A typed name is not that signature.
Switching or weakening the mode later requires authorisation under the mode
that is already in force. Do not downgrade it to get past a blocked approval.
