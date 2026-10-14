# development.performance.profiling — identity

Policy grade: profiling owns code-profiling, bottleneck-identification. Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Keep neighboring performance services outside the profiling decision for code-profiling, bottleneck-identification. Read the configured input at `rig-services/development.performance.profiling.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: profiling configuration validation only; declared policy does not prove running profiling behavior. Choose a repository-owned check that observes profiling from rig-services/development.performance.profiling.json.

Acceptance target: fixture:development.performance.profiling:policy-boundary. Given source-code is present and code-profiling is selected, pass only when the repository binding evaluates code-profiling and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance concern.

Service-specific evidence cues:
Offer: Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.
minimal: workload — "1000 item reads".
mid: measured metrics — ["latency_ms","allocations"].
maximal: optimize without measurement — false.
