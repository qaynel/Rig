# infrastructure.scaling-reliability.autoscaling — behavior-oracle slice

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Policy grade slice. This slice bounds autoscaling to scaling-reliability.autoscaling. It uses `autoscaling-slice-behavior-oracle` and checks scaling_metric (nonempty): scaling metric must name the concrete repository contract.