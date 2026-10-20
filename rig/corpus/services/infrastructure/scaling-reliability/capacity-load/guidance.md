# capacity-load

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Owned scope: `scaling-reliability.capacity-load`. Input: `rig-services/infrastructure.scaling-reliability.capacity-load.json`.

Coverage ceiling: Configuration validation only, so it confirms the load workload, latency objective and the unbounded-duration flag are declared; it does not generate load.

minimal: load workload — "100 concurrent requests". Describe the workload used to size capacity. Capacity against an unspecified load means nothing, so state the request mix and rate.

mid: slo latency ms — 250. Set the latency objective in milliseconds, at least 250. A tighter figure cannot be evidenced here, so choose a measurable limit.

maximal: unbounded load duration — false. Set unbounded load duration to false. An experiment without a stop time can damage the environment, so bound its length.
