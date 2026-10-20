# development.debugging.root-cause-analysis — identity

Policy grade: root cause analysis owns debugging.root-cause-analysis. Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Keep neighboring debugging services outside the root cause analysis decision for debugging.root-cause-analysis. Trace the verdict to the configured input at `rig-services/development.debugging.root-cause-analysis.json`; malformed input is still attributed to that path.

Disposition: executable. Anchor the review on the limit: root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Choose a repository-owned check that observes root cause analysis from rig-services/development.debugging.root-cause-analysis.json.

Acceptance target: policy:development.debugging.root-cause-analysis:minimal:root-cause-analysis-source-code-boundary.

Declared predicates: root-cause-analysis-source-code-boundary: `failure_boundary` is nonempty (a string or array).
