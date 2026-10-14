# infrastructure.scaling-reliability.autoscaling — identity

Policy grade: autoscaling owns scaling-reliability.autoscaling. Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Keep neighboring scaling-reliability services outside the autoscaling decision for scaling-reliability.autoscaling. Start from the configured input at `rig-services/infrastructure.scaling-reliability.autoscaling.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Choose a repository-owned check that observes autoscaling from rig-services/infrastructure.scaling-reliability.autoscaling.json.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:policy-boundary. Given source-code is present and scaling-reliability.autoscaling is selected, pass only when the repository binding evaluates scaling-reliability.autoscaling and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern.

Service-specific evidence cues:
Offer: Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.
minimal: scaling metric — "queue depth".
mid: maximum replicas — 10.
maximal: scale to zero without wakeup — false.
