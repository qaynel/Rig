# infrastructure.scaling-reliability.autoscaling — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for autoscaling; it does not widen ownership beyond scaling-reliability.autoscaling. The context signals are maximum_replicas. Binding checks: autoscaling-scaling-reliability-context.

Inspect the existing repository's autoscaling convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in scaling-reliability under their own verdicts.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:repository-context. Given scaling-reliability.autoscaling has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent scaling reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Owned scope: `scaling-reliability.autoscaling`.

Offer: Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Input: `rig-services/infrastructure.scaling-reliability.autoscaling.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Select an approved repository-owned command to verify that behavior.

minimal: scaling metric — "queue depth".

mid: maximum replicas — 10.

maximal: scale to zero without wakeup — false.
