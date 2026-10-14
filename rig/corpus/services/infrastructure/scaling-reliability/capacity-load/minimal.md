# infrastructure.scaling-reliability.capacity-load — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for capacity load. It checks load_workload (nonempty): load workload must name the concrete repository contract.. Binding checks: capacity-load-source-code-boundary.

Read a repository-owned command or existing native check that can observe scaling-reliability.capacity-load; bind it to the input named in `rig-services/infrastructure.scaling-reliability.capacity-load.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside scaling-reliability.capacity-load is a failure.

Acceptance target: fixture:infrastructure.scaling-reliability.capacity-load:policy-boundary. Given source-code is present and scaling-reliability.capacity-load is selected, pass only when the repository binding evaluates scaling-reliability.capacity-load and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Owned scope: `scaling-reliability.capacity-load`.

Offer: Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Input: `rig-services/infrastructure.scaling-reliability.capacity-load.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.

minimal: load workload — "100 concurrent requests".

mid: slo latency ms — 250.

maximal: unbounded load duration — false.
