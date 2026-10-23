# development.debugging.root-cause-analysis — minimal

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Policy grade, minimal: Name the first boundary where behavior diverged from expectation. Without it the fix targets the final symptom, so record the component and input where it first went wrong. Binding checks: root-cause-analysis-source-code-boundary.

Acceptance target: policy:development.debugging.root-cause-analysis:minimal:root-cause-analysis-source-code-boundary.
Declared predicates: root-cause-analysis-source-code-boundary: `failure_boundary` is nonempty (a string or array).
