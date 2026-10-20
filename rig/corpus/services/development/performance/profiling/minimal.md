# development.performance.profiling — minimal

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for profiling. The minimal boundary for profiling checks workload (nonempty): workload must name the concrete repository contract. Binding checks: profiling-source-code-boundary.

Use a repository-owned command or existing native check that can observe code-profiling, bottleneck-identification; bind it to the input named in `rig-services/development.performance.profiling.json` and preserve the check's failure status. When adopting this in an existing repository, connect profiling to the command that inspects workload and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-profiling, bottleneck-identification as a failure.

Acceptance target: policy:development.performance.profiling:minimal:profiling-source-code-boundary.

Declared predicates: profiling-source-code-boundary: `workload` is nonempty (a string or array).
