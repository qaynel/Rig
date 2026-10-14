# infrastructure.scaling-reliability.chaos-engineering — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for chaos engineering; it does not widen ownership beyond scaling-reliability.chaos-engineering. The context signals are stop_conditions. Binding checks: chaos-engineering-scaling-reliability-context.

Inspect the existing repository's chaos engineering convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in scaling-reliability under their own verdicts.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:repository-context. Given scaling-reliability.chaos-engineering has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent scaling reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Owned scope: `scaling-reliability.chaos-engineering`.

Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Input: `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.

minimal: fault scenarios — ["worker unavailable"].

mid: stop conditions — ["error budget exhausted"].

maximal: production experiment without approval — false.
