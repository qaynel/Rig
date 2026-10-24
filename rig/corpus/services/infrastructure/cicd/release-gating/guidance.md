# Release gating

Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Tie required release checks to the revision being released, and reject stale gate results. This service validates the declared JSON policy; it does not execute the gates or prove that a deployed artifact matches the revision.

Owned scope: `cicd.release-gating`.

Input: `rig-services/infrastructure.cicd.release-gating.json` (JSON).

Checks by grade:

- Minimal: `required_gates` is a nonempty list.
- Mid: `release_revision` is a nonempty string.
- Maximal: `use_stale_gate_results` equals `false`.

Coverage ceiling: configuration validation only. The repository's CI and release process must supply evidence that the named revision and artifact passed the required gates.
