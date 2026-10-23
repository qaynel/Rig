# development.debugging.root-cause-analysis — maximal

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Policy grade, maximal: Set symptom-only fix to false. Masking the final symptom leaves the shared cause in place, so fix the cause and keep a reproduction. Cumulative with minimal and mid. Binding checks: root-cause-analysis-source-code-boundary, root-cause-analysis-debugging-context, root-cause-analysis-evidence-receipt.

Acceptance target: policy:development.debugging.root-cause-analysis:maximal:root-cause-analysis-source-code-boundary+root-cause-analysis-debugging-context+root-cause-analysis-evidence-receipt.
Declared predicates: root-cause-analysis-source-code-boundary: `failure_boundary` is nonempty (a string or array); root-cause-analysis-debugging-context: `causal_evidence` is nonempty (a string or array); root-cause-analysis-evidence-receipt: `symptom_only_fix` equals false.
