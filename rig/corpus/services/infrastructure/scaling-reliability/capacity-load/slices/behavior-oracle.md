# infrastructure.scaling-reliability.capacity-load — behavior-oracle slice

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Policy grade slice. This slice bounds capacity load to scaling-reliability.capacity-load. It uses `capacity-load-slice-behavior-oracle` and checks load_workload (nonempty): load workload must name the concrete repository contract.