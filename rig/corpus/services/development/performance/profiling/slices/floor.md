# development.performance.profiling — floor and mutation-floor slice

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Policy grade slice. This slice bounds profiling to code-profiling, bottleneck-identification. It uses `profiling-slice-floor` and checks workload (nonempty): workload must name the concrete repository contract.