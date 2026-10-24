# development.performance.profiling — behavior-oracle slice

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Policy grade slice `profiling-slice-behavior-oracle`: Name the representative workload that was profiled. A profile of an unspecified run cannot be repeated, so describe the input and environment. Despite its name this slice is not a behavior oracle: it confirms the workload, measured metrics and the no-guess flag are declared; it does not show a profile was actually taken.
