# infrastructure.cicd.release-gating — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for release gating. It checks required_gates (nonempty): required gates must name the concrete repository contract.. Binding checks: release-gating-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe cicd.release-gating; bind it to the input named in `rig-services/infrastructure.cicd.release-gating.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside cicd.release-gating is a failure.

Acceptance target: fixture:infrastructure.cicd.release-gating:policy-boundary. Given source-code is present and cicd.release-gating is selected, pass only when the repository binding evaluates cicd.release-gating and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Owned scope: `cicd.release-gating`.

Offer: Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Input: `rig-services/infrastructure.cicd.release-gating.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: release gating configuration validation only; declared policy does not prove running release gating behavior. Select an approved repository-owned command to verify that behavior.

minimal: required gates — ["tests","artifact digest"].

mid: release revision — "a1b2c3d".

maximal: use stale gate results — false.
