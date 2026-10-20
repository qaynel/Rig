# infrastructure.scaling-reliability.capacity-load — behavior-oracle slice

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Policy grade slice `capacity-load-slice-behavior-oracle`: Describe the workload used to size capacity. Capacity against an unspecified load means nothing, so state the request mix and rate. Despite its name this slice is not a behavior oracle: it confirms the load workload, latency objective and the unbounded-duration flag are declared; it does not generate load.
