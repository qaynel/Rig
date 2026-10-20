# infrastructure.scaling-reliability.capacity-load — minimal

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for capacity load. The minimal boundary for capacity load checks load_workload (nonempty): load workload must name the concrete repository contract. Binding checks: capacity-load-source-code-boundary.

Read a repository-owned command or existing native check that can observe scaling-reliability.capacity-load; bind it to the input named in `rig-services/infrastructure.scaling-reliability.capacity-load.json` and preserve the check's failure status. When adopting this in an existing repository, connect capacity load to the command that inspects load_workload and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside scaling-reliability.capacity-load as a failure.

Acceptance target: policy:infrastructure.scaling-reliability.capacity-load:minimal:capacity-load-source-code-boundary.

Declared predicates: capacity-load-source-code-boundary: `load_workload` is nonempty (a string or array).
