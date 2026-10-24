# infrastructure.cicd.release-gating — minimal

Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Grade: minimal. Policy grade. Check: release-gating-source-code-boundary.

Minimal checks that `required_gates` names at least one required release check in `rig-services/infrastructure.cicd.release-gating.json`.

The good fixture's list contains `tests` and `artifact digest`, so this predicate passes. The bad fixture's list is empty, so it fails. This does not establish that either check ran.
