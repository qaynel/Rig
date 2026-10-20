# development.debugging.root-cause-analysis — property-floor slice

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Policy grade slice. This slice bounds root cause analysis to debugging.root-cause-analysis. It uses `root-cause-analysis-slice-property-floor` and checks failure_boundary (nonempty): failure boundary must name the concrete repository contract.