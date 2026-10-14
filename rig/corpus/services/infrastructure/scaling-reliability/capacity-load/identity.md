# infrastructure.scaling-reliability.capacity-load — identity

Policy grade: capacity load owns scaling-reliability.capacity-load. Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Keep sibling services in scaling-reliability under their own verdicts. Inspect the configured input at `rig-services/infrastructure.scaling-reliability.capacity-load.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.scaling-reliability.capacity-load:policy-boundary. Given source-code is present and scaling-reliability.capacity-load is selected, pass only when the repository binding evaluates scaling-reliability.capacity-load and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern.

Service-specific evidence cues:
Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Owned scope: `scaling-reliability.capacity-load`.

Offer: Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Input: `rig-services/infrastructure.scaling-reliability.capacity-load.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.

minimal: load workload — "100 concurrent requests".

mid: slo latency ms — 250.

maximal: unbounded load duration — false.
