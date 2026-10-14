# development.debugging.root-cause-analysis — behavior-oracle slice

Policy grade slice. This slice bounds root cause analysis to debugging.root-cause-analysis. It uses `root-cause-analysis-slice-behavior-oracle` and checks failure_boundary (nonempty): failure boundary must name the concrete repository contract..

For root cause analysis, choose a repository example that satisfies failure_boundary at the behavior-oracle floor, plus a failure where failure boundary must name the concrete repository contract. is false. For root cause analysis, wire `behavior-oracle` to `rig-services/development.debugging.root-cause-analysis.json` and keep its verdict on failure_boundary; missing evidence is a named gap, with ceiling root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Choose a repository-owned check that observes root cause analysis from rig-services/development.debugging.root-cause-analysis.json..

Service-specific evidence cues:
Offer: Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.
minimal: failure boundary — "parser rejects malformed record".
mid: causal evidence — ["repro case fails at parser"].
maximal: symptom only fix — false.
