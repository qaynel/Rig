# infrastructure.scaling-reliability.autoscaling — property-floor slice

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Policy grade slice `autoscaling-slice-property-floor`: Choose the metric that drives scaling, such as CPU or queue depth. Without one nothing triggers a change, so name it.
