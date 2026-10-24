# infrastructure.scaling-reliability.capacity-load — floor and mutation-floor slice

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Policy grade slice `capacity-load-slice-floor`: Describe the workload used to size capacity. Capacity against an unspecified load means nothing, so state the request mix and rate.
