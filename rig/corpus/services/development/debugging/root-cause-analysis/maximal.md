# development.debugging.root-cause-analysis — maximal

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: root-cause-analysis-source-code-boundary, root-cause-analysis-debugging-context, root-cause-analysis-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.debugging.root-cause-analysis:maximal:root-cause-analysis-source-code-boundary+root-cause-analysis-debugging-context+root-cause-analysis-evidence-receipt.

Declared predicates: root-cause-analysis-source-code-boundary: `failure_boundary` is nonempty (a string or array); root-cause-analysis-debugging-context: `causal_evidence` is nonempty (a string or array); root-cause-analysis-evidence-receipt: `symptom_only_fix` equals false.
