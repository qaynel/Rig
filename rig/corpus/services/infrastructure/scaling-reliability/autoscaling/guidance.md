# autoscaling

Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Owned scope: `scaling-reliability.autoscaling`. Input: `rig-services/infrastructure.scaling-reliability.autoscaling.json`.

Coverage ceiling: Configuration validation only, so it confirms the scaling metric, a replica ceiling and the scale-to-zero flag are declared; it does not show scaling happens.

minimal: scaling metric — "queue depth". Choose the metric that drives scaling, such as CPU or queue depth. Without one nothing triggers a change, so name it.

mid: maximum replicas — 10. Set a maximum replica count of at least 10 or the intended ceiling. An unbounded count can exhaust the budget, so cap it.

maximal: scale to zero without wakeup — false. Set scale to zero without a wakeup route to false. A service scaled to zero with no wakeup is down, so provide the wakeup path first.
