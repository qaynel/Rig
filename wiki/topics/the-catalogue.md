# The à-la-carte catalogue

## What it is

Rig offers four families, groups within those families, and 115 independently
selectable services. Each service has cumulative `minimal / mid / maximal`
packaging, mapped to Policy, Context, and Evidence assurance inside that
service's owned domain. Scan recommendations are advisory; the user may select
any leaf and grade.

The separate 55-skill shelf is vendored operating method. It is installed by
Rig name with upstream notice/provenance, but it does not replace the 115-leaf
selection and evidence model.

## The skill shelf is its own taxonomy

Since Path B slice 1 the shelf is a second, entirely separate catalogue. Its
source lives at `rig/catalog/skills/<family>/<capability-leaf>/<source-dir>/SKILL.md`
under eleven doctrine families declared as data in
`rig/catalog/skills/families.json`. Each `SKILL.md` self-declares `family`,
`tool`, `capability`, `guarantees`, and `overlap_tags`; nothing is inferred
from a directory name or a vendor prefix.

`scripts/build-skill-catalog.js` generates `rig/catalog/skills/catalog.json`
(63 skills: 55 optional + 7 core workflow + `rig-onboarding`), and
`--check` runs inside the `npm test` gate so the committed artefact cannot
drift from its sources. The adaptive install pins those exact bytes at
`.rig/catalog.json` and refuses to overwrite a user-edited copy. This shelf
never imports, rewrites, or reads a 115-service selection — `rig/catalog.json`
and `rig/catalog/services/**` stay byte-identical.
[Slice 1 trace](../reasoning/2026-09-01-path-b-slice1-catalogue.md)

## Current release shape

D24 makes the beta broad and shallow: all 115 leaves ship at Policy grade and
declare themselves generic, untailored baseline practice. Lint/format is the
only leaf currently backed for higher-grade claims. Every other leaf names its
owned scope, applicability, dependencies, disposition, exact checks, and slice
behavior; a missing repository binding reports a coverage gap instead of
passing vacuously.

The tagged-release payload installs `catalog.json`, every service fragment,
baseline assets, the safety/runtime modules, all 55 neutral skills, and their
plumbing even when no host marker is detected. Detected hosts receive only
their additional native skill/instruction tree. The local Tier-1 bootstrap
keeps its static-only boundary: by default it installs all 55 skills as
markdown only (`SKILL.md` plus docs), leaving per-skill code and the plumbing
tree out unless `--with-runtime` is passed — the same `active_delivery` gate
that already covered the runtime engine ([AD-37](../index/decisions.md)).

## Why

Fixed Basic/mid/Advanced packages could not express repository-specific needs.
The catalogue preserves individual user choice and razor-scoped dependencies,
while the Policy/Context/Evidence ladder states how much of each selected
service has actually been proven.

## Authorities and sources

- Frozen inventory and choice model: [business specification](../gate1/business-spec.md)
- Working catalogue contract: [technical specification](../gate2/technical-spec.md#5-catalogue-contract)
- D24 broad Policy release: [intent-owner trace](../reasoning/2026-08-21-mvp-agent-discretion-build.md)
- Vendored-skill approval: [owner approval](../reasoning/2026-08-21-d24-owner-approval.md)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)
- Lean default install: [lean-install protocol](../reasoning/2026-08-23-lean-install-protocol.md)

## Remaining work

The current packs meet the Policy authorship contract. Beta use determines
which leaves earn repository-specific Context and rerunnable Evidence next; the
grade must never advance from prose alone.

The first real adaptation run (2026-08-30, `inspo/claude-task-master-main/`,
+12/100) put a number on the à-la-carte model's failure mode: installing the
full catalogue onto a Node/TS CLI monorepo scored signal-vs-noise as *poor —
~85% dead weight by skill count* (ios-qa, make-pdf, design-shotgun, office-hours,
scrape … on a repo that needs ~7 of 65 skills). This is the concrete case for
pruning the installed set to what the repo's stack implies rather than shipping
everything, and it stands against the "Rig has everything" framing.
[Adaptation eval](../reasoning/2026-08-30-adaptation-eval-claude-task-master.md)

<!-- Reviewed 2026-09-02 during wiki-maintenance step 2; hub already reflects newest current-trace decisions. -->
