# infrastructure.cicd.release-gating — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for release gating; it does not widen ownership beyond cicd.release-gating. The context signals are release_revision. Binding checks: release-gating-cicd-context.

Anchor the review on the existing repository's release gating convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cicd under their own verdicts.

Acceptance target: fixture:infrastructure.cicd.release-gating:repository-context. Given cicd.release-gating has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cicd concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Owned scope: `cicd.release-gating`.

Offer: Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Input: `rig-services/infrastructure.cicd.release-gating.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: release gating configuration validation only; declared policy does not prove running release gating behavior. Select an approved repository-owned command to verify that behavior.

minimal: required gates — ["tests","artifact digest"].

mid: release revision — "a1b2c3d".

maximal: use stale gate results — false.
