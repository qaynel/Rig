# Distribution and release

## What it is

A stranger with `git`, `curl`, and `sh` but no checkout must be able to install
Rig from a named released tag. The root `install.sh` resolves `latest` to a
concrete tag, downloads before execution, and records that tag. Release requires
all specification, service, host/CI, acceptance, compatibility, and full-suite
gates to pass. [Gate 2 §12.3–12.4](../gate2/technical-spec.md#123-release-gate)

## Why it is this way

The delivery path is part of the product: source that a stranger cannot safely
install is not shipped. Named tags make each install reproducible without
inventing a fingerprint stored beside the code it claims to protect. Downloading
before execution respects Rig's own default denial of remote-content execution.
[Gate 1 D7/D18](../gate1/business-spec.md)

## What binds it

`D7`, `D18`, and `AD-27` define installation, version scope, and stub behavior.
The nine ordered release checks in Gate 2 §12.3 are cumulative; none substitutes
for another. [Decision index](../index/decisions.md)

## What was rejected

`curl | sh`, branch-based installs, a same-repository build fingerprint, inherited
npm publishing, fixed install tiers, and automatic destructive migration were
rejected. [Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Frozen delivery requirement: [Gate 1](../gate1/business-spec.md)
- Compatibility and release: [Gate 2 §12](../gate2/technical-spec.md#12-compatibility-and-rollout)
- Cleanup survey rulings: [reasoning trace](../reasoning/2026-08-20-cleanup-survey-decisions.md)

## What is still open

`install.sh` does not exist and the package remains `4.8.4`. The inherited npm
publish workflow has been deleted. [Status](../status.md#what-exists-in-the-code-today)

**D24 (2026-08-21) promotes distribution from Slice 13 to MVP step 3**, directly
after the specification gate and before the bulk catalogue authoring. The
reasoning is time-to-beta: distribution is the first step that produces
something a stranger can hold, so it lands early rather than at the end. The
mechanism is unchanged — a named released tag, downloaded before execution,
never `curl | sh`. Step 3 also wires all 55 swallowed skills into materialize
and host discovery, without which they are not installable at all.
[roadmap](../specs/mvp-roadmap.md) ·
[ruling](../reasoning/2026-08-21-mvp-agent-discretion-build.md)

The prior legal blocker is **resolved by the intent owner**. The swallowed
source was traced to
`garrytan/gstack` version `1.60.1.0` at commit `7c9df1c…`; its MIT copyright and
permission notice is restored beside the vendored files, with the local rename,
omissions, and sanitation recorded as modifications. The owner approved the
modified partial distribution under MIT on 2026-08-21, conditional on shipping
the notice and provenance with every installed copy and making no upstream-
endorsement claim. [Approval](../reasoning/2026-08-21-d24-owner-approval.md)
[v0.12 retrace](../reasoning/2026-08-22-gate2-v0.12-d24-retrace.md)
