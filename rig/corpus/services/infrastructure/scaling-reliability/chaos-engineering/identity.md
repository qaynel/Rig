# infrastructure.scaling-reliability.chaos-engineering — identity

Policy grade: chaos engineering owns scaling-reliability.chaos-engineering. Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Keep neighboring scaling-reliability services outside the chaos engineering decision for scaling-reliability.chaos-engineering. Start from the configured input at `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Choose a repository-owned check that observes chaos engineering from rig-services/infrastructure.scaling-reliability.chaos-engineering.json.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:policy-boundary. Given source-code is present and scaling-reliability.chaos-engineering is selected, pass only when the repository binding evaluates scaling-reliability.chaos-engineering and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern.

Service-specific evidence cues:
Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.
minimal: fault scenarios — ["worker unavailable"].
mid: stop conditions — ["error budget exhausted"].
maximal: production experiment without approval — false.
