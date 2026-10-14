# infrastructure.scaling-reliability.capacity-load — floor and mutation-floor slice

Policy grade slice. This slice bounds capacity load to scaling-reliability.capacity-load. It uses `capacity-load-slice-floor` and checks load_workload (nonempty): load workload must name the concrete repository contract..

For capacity load, choose a repository example that satisfies load_workload at the floor and mutation-floor floor, plus a failure where load workload must name the concrete repository contract. is false. For capacity load, wire `floor and mutation-floor` to `rig-services/infrastructure.scaling-reliability.capacity-load.json` and keep its verdict on load_workload; missing evidence is a named gap, with ceiling capacity load configuration validation only; declared policy does not prove running capacity load behavior. Choose a repository-owned check that observes capacity load from rig-services/infrastructure.scaling-reliability.capacity-load.json..

Service-specific evidence cues:
Offer: Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.
minimal: load workload — "100 concurrent requests".
mid: slo latency ms — 250.
maximal: unbounded load duration — false.
