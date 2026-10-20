# development.debugging.structured-debugging — maximal

Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Policy grade, maximal: Set change before reproduction to false. Editing code before the failure reproduces destroys the evidence, so reproduce first. Cumulative with minimal and mid. Binding checks: structured-debugging-source-code-boundary, structured-debugging-debugging-context, structured-debugging-evidence-receipt.

Acceptance target: policy:development.debugging.structured-debugging:maximal:structured-debugging-source-code-boundary+structured-debugging-debugging-context+structured-debugging-evidence-receipt.
Declared predicates: structured-debugging-source-code-boundary: `reproduction_steps` is nonempty (a string or array); structured-debugging-debugging-context: `ranked_hypotheses` is nonempty (a string or array); structured-debugging-evidence-receipt: `change_before_reproduction` equals false.
