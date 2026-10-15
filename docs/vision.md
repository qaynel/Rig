# Rig 6.0.0

Rig is a shared toolbox for people who use coding agents in existing software
repositories. It gives an agent a common engineering workflow and lets the
repository owner choose additional services for the work the project needs.
Rig starts from the repository's current instructions and tools; it does not
assume every project should look the same.

## What ships

Rig's rules, skills, standards, onboarding instructions, and service catalogue
have one canonical home in `rig/corpus/`. Install places that corpus and its
active runtime in the repository. The project's own agent inspects the existing
setup, proposes the smallest useful adaptation, and explains the selected
services and their coverage limits. A human reviews and approves the exact
proposal before Rig applies journaled changes. The agent then checks the
result. Installation does not run onboarding or change repository-owned files
by itself.

The 6.0.0 catalogue contains 115 completed service leaves across development,
testing, product security, and infrastructure. A project selects services and
assurance grades à la carte; there are no fixed capability packages. Services
reuse available tools. If a tool, input, or applicable surface is missing,
Rig reports a named gap rather than claiming the check passed.

Third-party skills selected during onboarding are fetched from pinned upstream
revisions. Rig verifies archive and file digests, keeps the required licence,
applies pinned local patches, and records provenance. A missing or changed
upstream resource remains an explicit gap. Agent-written projectors require
human approval and a verifiable filesystem and network sandbox.

## Who it is for

Rig is for teams that want their coding agents to follow a repeatable
engineering process while preserving the repository's existing authorities.
It is useful when a team needs to add a specific workflow guarantee, tool check,
or service without replacing its current instructions or installing an
unrequested bundle.

## What comes after this release

The owner has deferred five never-started initiatives to a separate redesign:
promoting more catalogue leaves beyond Policy assurance, deciding whether the
wiki knowledge system should become a service family, adding memory to the
review loop, changing how the acceptance oracle is authored, and re-baselining
the adaptation score ([redesign backlog](../wiki/specs/redesign-backlog.md)).
These are future decisions, not missing parts of 6.0.0.
This release does not promise a per-host rollout or automatic installation of
external scanners and cloud tools.

See the [install guide](install.md), [troubleshooting](troubleshooting.md), and
[operator guide](advanced/operator.md) for the shipped workflow.
