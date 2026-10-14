# infrastructure.scaling-reliability.autoscaling — property-floor slice

Policy grade slice. This slice bounds autoscaling to scaling-reliability.autoscaling. It uses `autoscaling-slice-property-floor` and checks scaling_metric (nonempty): scaling metric must name the concrete repository contract..

For autoscaling, choose a repository example that satisfies scaling_metric at the property-floor floor, plus a failure where scaling metric must name the concrete repository contract. is false. For autoscaling, wire `property-floor` to `rig-services/infrastructure.scaling-reliability.autoscaling.json` and keep its verdict on scaling_metric; missing evidence is a named gap, with ceiling autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Choose a repository-owned check that observes autoscaling from rig-services/infrastructure.scaling-reliability.autoscaling.json..

Service-specific evidence cues:
Offer: Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.
minimal: scaling metric — "queue depth".
mid: maximum replicas — 10.
maximal: scale to zero without wakeup — false.
