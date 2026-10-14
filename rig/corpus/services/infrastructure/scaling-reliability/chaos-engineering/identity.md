# infrastructure.scaling-reliability.chaos-engineering — identity

Policy grade: chaos engineering owns scaling-reliability.chaos-engineering. Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Keep sibling services in scaling-reliability under their own verdicts. Start from the configured input at `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:policy-boundary. Given source-code is present and scaling-reliability.chaos-engineering is selected, pass only when the repository binding evaluates scaling-reliability.chaos-engineering and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern.

Service-specific evidence cues:
Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Owned scope: `scaling-reliability.chaos-engineering`.

Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Input: `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.

minimal: fault scenarios — ["worker unavailable"].

mid: stop conditions — ["error budget exhausted"].

maximal: production experiment without approval — false.
