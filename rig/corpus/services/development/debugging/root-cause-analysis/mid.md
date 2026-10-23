# development.debugging.root-cause-analysis — mid

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Policy grade, mid: Record the observation that links cause to failure, such as a log line or failing input. Claims without evidence cannot be re-checked, so attach the trace. Cumulative with minimal. Binding checks: root-cause-analysis-source-code-boundary, root-cause-analysis-debugging-context.

Acceptance target: policy:development.debugging.root-cause-analysis:mid:root-cause-analysis-source-code-boundary+root-cause-analysis-debugging-context.
Declared predicates: root-cause-analysis-source-code-boundary: `failure_boundary` is nonempty (a string or array); root-cause-analysis-debugging-context: `causal_evidence` is nonempty (a string or array).
