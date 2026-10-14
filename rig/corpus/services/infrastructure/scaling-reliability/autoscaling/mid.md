# infrastructure.scaling-reliability.autoscaling — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for autoscaling; it does not widen ownership beyond scaling-reliability.autoscaling. For autoscaling, inspect these context signals: maximum_replicas. Binding checks: autoscaling-scaling-reliability-context.

Inspect the existing repository's autoscaling convention, then name the source path or command that establishes it. For autoscaling, inspect the repository's actual spec, source, test, or configuration for maximum_replicas; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring scaling-reliability services outside the autoscaling decision for scaling-reliability.autoscaling.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:repository-context. Given scaling-reliability.autoscaling has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent scaling reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.
minimal: scaling metric — "queue depth".
mid: maximum replicas — 10.
maximal: scale to zero without wakeup — false.
