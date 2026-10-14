# infrastructure.scaling-reliability.chaos-engineering — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for chaos engineering. It checks fault_scenarios (nonempty): fault scenarios must name the concrete repository contract.. Binding checks: chaos-engineering-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe scaling-reliability.chaos-engineering; bind it to the input named in `rig-services/infrastructure.scaling-reliability.chaos-engineering.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside scaling-reliability.chaos-engineering is a failure.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:policy-boundary. Given source-code is present and scaling-reliability.chaos-engineering is selected, pass only when the repository binding evaluates scaling-reliability.chaos-engineering and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Owned scope: `scaling-reliability.chaos-engineering`.

Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Input: `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.

minimal: fault scenarios — ["worker unavailable"].

mid: stop conditions — ["error budget exhausted"].

maximal: production experiment without approval — false.
