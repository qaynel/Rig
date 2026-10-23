# Swallowed skill catalogue

A rough, first-pass vendoring of the upstream gstack skill suite into Rig. Every
skill, helper, and reference was renamed to Rig's namespace (`gstack` → `rig`,
`gbrain` → `brain`); no runtime-facing filename or command reference carries
the old name, so each capability is callable by its Rig name (`rig-qa`,
`rig-ship`, `rig-browse`, …). Attribution and provenance deliberately retain
the upstream name.

The source is a modified partial distribution of `garrytan/gstack` version
`1.60.1.0`. See [`UPSTREAM.md`](UPSTREAM.md) for the pinned commit and changes,
and [`LICENSE.upstream`](LICENSE.upstream) for the preserved MIT notice.

## Delivery

This source tree is the pinned reference for optional skills. A normal install
stages no optional skill tree. After a person approves a selected skill,
onboarding fetches the pinned archive, verifies its digests and patches,
projects the selected files into the active host location, and preserves pinned
executable modes. Missing runtime prerequisites are reported as named gaps;
they are never represented as an installed, runnable capability.

The earlier “rough, not yet wired” description was historical. It does not
describe the current onboarding and projection path.

## Sanitation applied to stay CI-green

The repo's secret floor is stricter than upstream's placeholder-aware detector.
Three illustrative shapes were neutralized so `npm test` passes: an AWS docs
example key, a PEM private-key header in a code comment, and a preference enum
whose spelling contained a token-shaped prefix, renamed uniformly to
`ask-only-oneway`. Upstream's release `CHANGELOG.md` was dropped as
non-functional noise.
