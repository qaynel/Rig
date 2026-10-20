# development.performance.profiling — identity

Policy grade: profiling owns code-profiling, bottleneck-identification. Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Keep neighboring performance services outside the profiling decision for code-profiling, bottleneck-identification. Read the configured input at `rig-services/development.performance.profiling.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: profiling configuration validation only; declared policy does not prove running profiling behavior. Choose a repository-owned check that observes profiling from rig-services/development.performance.profiling.json.

Acceptance target: policy:development.performance.profiling:minimal:profiling-source-code-boundary.

Declared predicates: profiling-source-code-boundary: `workload` is nonempty (a string or array).
