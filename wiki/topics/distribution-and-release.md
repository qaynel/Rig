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
publish workflow has been deleted. Distribution is Slice 13 after the preceding product
mechanisms exist. [Status](../status.md#what-exists-in-the-code-today)
