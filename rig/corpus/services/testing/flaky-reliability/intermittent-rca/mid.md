# testing.flaky-reliability.intermittent-rca — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for intermittent rca; it does not widen ownership beyond flaky-reliability.intermittent-rca. The context signals are reproduction_attempts. Binding checks: intermittent-rca-flaky-reliability-context.

Inspect the existing repository's intermittent rca convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in flaky-reliability under their own verdicts.

Acceptance target: fixture:testing.flaky-reliability.intermittent-rca:repository-context. Given flaky-reliability.intermittent-rca has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent flaky reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Owned scope: `flaky-reliability.intermittent-rca`.

Offer: Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Input: `rig-services/testing.flaky-reliability.intermittent-rca.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Select an approved repository-owned command to verify that behavior.

minimal: observed conditions — ["parallel runs"].

mid: reproduction attempts — ["repeat with scheduler seed"].

maximal: blame randomness without evidence — false.
