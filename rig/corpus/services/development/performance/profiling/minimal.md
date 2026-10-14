# development.performance.profiling — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for profiling. The minimal boundary for profiling checks workload (nonempty): workload must name the concrete repository contract.. Binding checks: profiling-source-code-boundary.

Use a repository-owned command or existing native check that can observe code-profiling, bottleneck-identification; bind it to the input named in `rig-services/development.performance.profiling.json` and preserve the check's failure status. When adopting this in an existing repository, connect profiling to the command that inspects workload and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-profiling, bottleneck-identification as a failure.

Acceptance target: fixture:development.performance.profiling:policy-boundary. Given source-code is present and code-profiling is selected, pass only when the repository binding evaluates code-profiling and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance concern. The ceiling is profiling configuration validation only; declared policy does not prove running profiling behavior. Choose a repository-owned check that observes profiling from rig-services/development.performance.profiling.json..

Service-specific evidence cues:
Offer: Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.
minimal: workload — "1000 item reads".
mid: measured metrics — ["latency_ms","allocations"].
maximal: optimize without measurement — false.
