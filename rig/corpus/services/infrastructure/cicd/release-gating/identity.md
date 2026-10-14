# infrastructure.cicd.release-gating — identity

Policy grade: release gating owns cicd.release-gating. Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Keep sibling services in cicd under their own verdicts. Use the configured input at `rig-services/infrastructure.cicd.release-gating.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: release gating configuration validation only; declared policy does not prove running release gating behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cicd.release-gating:policy-boundary. Given source-code is present and cicd.release-gating is selected, pass only when the repository binding evaluates cicd.release-gating and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern.

Service-specific evidence cues:
Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Owned scope: `cicd.release-gating`.

Offer: Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Input: `rig-services/infrastructure.cicd.release-gating.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: release gating configuration validation only; declared policy does not prove running release gating behavior. Select an approved repository-owned command to verify that behavior.

minimal: required gates — ["tests","artifact digest"].

mid: release revision — "a1b2c3d".

maximal: use stale gate results — false.
