# development.performance.profiling — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for profiling; it does not widen ownership beyond code-profiling, bottleneck-identification. The context signals are measured_metrics. Binding checks: profiling-performance-context.

Start from the existing repository's profiling convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in performance under their own verdicts.

Acceptance target: fixture:development.performance.profiling:repository-context. Given code-profiling has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Owned scope: `code-profiling`, `bottleneck-identification`.

Offer: Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Input: `rig-services/development.performance.profiling.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: profiling configuration validation only; declared policy does not prove running profiling behavior. Select an approved repository-owned command to verify that behavior.

minimal: workload — "1000 item reads".

mid: measured metrics — ["latency_ms","allocations"].

maximal: optimize without measurement — false.
