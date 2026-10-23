# development.performance.profiling — identity

Policy grade: profiling owns code-profiling, bottleneck-identification. Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Input: `rig-services/development.performance.profiling.json`. Configuration validation only, so it confirms the workload, measured metrics and the no-guess flag are declared; it does not show a profile was actually taken.

Disposition: executable.
Acceptance target: policy:development.performance.profiling:minimal:profiling-source-code-boundary.
Declared predicates: profiling-source-code-boundary: `workload` is nonempty (a string or array).
