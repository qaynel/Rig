# infrastructure.scaling-reliability.autoscaling — behavior-oracle slice

Policy grade slice. This slice bounds autoscaling to scaling-reliability.autoscaling. It uses `autoscaling-slice-behavior-oracle` and checks scaling_metric (nonempty): scaling metric must name the concrete repository contract..

For autoscaling, choose a repository example that satisfies scaling_metric at the behavior-oracle floor, plus a failure where scaling metric must name the concrete repository contract. is false. For autoscaling, wire `behavior-oracle` to `rig-services/infrastructure.scaling-reliability.autoscaling.json` and keep its verdict on scaling_metric; missing evidence is a named gap, with ceiling autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Choose a repository-owned check that observes autoscaling from rig-services/infrastructure.scaling-reliability.autoscaling.json..

Service-specific evidence cues:
Offer: Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.
minimal: scaling metric — "queue depth".
mid: maximum replicas — 10.
maximal: scale to zero without wakeup — false.
