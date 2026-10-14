# development.performance.profiling — identity

profiling owns code-profiling, bottleneck-identification. Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Keep sibling services in performance under their own verdicts. Read the configured input at `rig-services/development.performance.profiling.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: profiling configuration validation only; declared policy does not prove running profiling behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.performance.profiling:policy-boundary. Given source-code is present and code-profiling is selected, pass only when the repository binding evaluates code-profiling and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance concern.
