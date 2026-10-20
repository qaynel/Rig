# development.debugging.root-cause-analysis — mid

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: root-cause-analysis-source-code-boundary, root-cause-analysis-debugging-context.

Tie acceptance to the existing repository's root cause analysis convention, then name the source path or command that establishes it. For root cause analysis, inspect the repository's actual spec, source, test, or configuration for causal_evidence; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring debugging services outside the root cause analysis decision for debugging.root-cause-analysis.

Acceptance target: policy:development.debugging.root-cause-analysis:mid:root-cause-analysis-source-code-boundary+root-cause-analysis-debugging-context.

Declared predicates: root-cause-analysis-source-code-boundary: `failure_boundary` is nonempty (a string or array); root-cause-analysis-debugging-context: `causal_evidence` is nonempty (a string or array).
