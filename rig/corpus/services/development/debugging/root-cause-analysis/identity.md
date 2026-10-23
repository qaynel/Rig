# development.debugging.root-cause-analysis — identity

Policy grade: root-cause-analysis owns debugging.root-cause-analysis. Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Input: `rig-services/development.debugging.root-cause-analysis.json`. Configuration validation only, so it confirms the failure boundary, causal evidence and the symptom-only-fix flag are declared; it does not show the cause is correct.

Disposition: executable.
Acceptance target: policy:development.debugging.root-cause-analysis:minimal:root-cause-analysis-source-code-boundary.
Declared predicates: root-cause-analysis-source-code-boundary: `failure_boundary` is nonempty (a string or array).
