# development.debugging.root-cause-analysis — floor and mutation-floor slice

Policy grade slice. This slice bounds root cause analysis to debugging.root-cause-analysis. It uses `root-cause-analysis-slice-floor` and checks failure_boundary (nonempty): failure boundary must name the concrete repository contract..

Start from a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.debugging.root-cause-analysis.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Owned scope: `debugging.root-cause-analysis`.

Offer: Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Input: `rig-services/development.debugging.root-cause-analysis.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Select an approved repository-owned command to verify that behavior.

minimal: failure boundary — "parser rejects malformed record".

mid: causal evidence — ["repro case fails at parser"].

maximal: symptom only fix — false.
