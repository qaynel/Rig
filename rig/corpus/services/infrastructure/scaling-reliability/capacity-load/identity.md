# infrastructure.scaling-reliability.capacity-load — identity

Policy grade: capacity load owns scaling-reliability.capacity-load. Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Keep neighboring scaling-reliability services outside the capacity load decision for scaling-reliability.capacity-load. Inspect the configured input at `rig-services/infrastructure.scaling-reliability.capacity-load.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: capacity load configuration validation only; declared policy does not prove running capacity load behavior. Choose a repository-owned check that observes capacity load from rig-services/infrastructure.scaling-reliability.capacity-load.json.

Acceptance target: policy:infrastructure.scaling-reliability.capacity-load:minimal:capacity-load-source-code-boundary.

Declared predicates: capacity-load-source-code-boundary: `load_workload` is nonempty (a string or array).
