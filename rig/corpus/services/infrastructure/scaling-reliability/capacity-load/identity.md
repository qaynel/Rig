# infrastructure.scaling-reliability.capacity-load — identity

Policy grade: capacity-load owns scaling-reliability.capacity-load. Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Input: `rig-services/infrastructure.scaling-reliability.capacity-load.json`. Configuration validation only, so it confirms the load workload, latency objective and the unbounded-duration flag are declared; it does not generate load.

Disposition: executable.
Acceptance target: policy:infrastructure.scaling-reliability.capacity-load:minimal:capacity-load-source-code-boundary.
Declared predicates: capacity-load-source-code-boundary: `load_workload` is nonempty (a string or array).
