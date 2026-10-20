# infrastructure.scaling-reliability.autoscaling — floor and mutation-floor slice

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Policy grade slice. This slice bounds autoscaling to scaling-reliability.autoscaling. It uses `autoscaling-slice-floor` and checks scaling_metric (nonempty): scaling metric must name the concrete repository contract.