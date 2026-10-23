# infrastructure.scaling-reliability.autoscaling — behavior-oracle slice

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Policy grade slice `autoscaling-slice-behavior-oracle`: Choose the metric that drives scaling, such as CPU or queue depth. Without one nothing triggers a change, so name it. Despite its name this slice is not a behavior oracle: it confirms the scaling metric, a replica ceiling and the scale-to-zero flag are declared; it does not show scaling happens.
