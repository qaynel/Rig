# development.debugging.structured-debugging — maximal

Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: structured-debugging-source-code-boundary, structured-debugging-debugging-context, structured-debugging-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.debugging.structured-debugging:maximal:structured-debugging-source-code-boundary+structured-debugging-debugging-context+structured-debugging-evidence-receipt.

Declared predicates: structured-debugging-source-code-boundary: `reproduction_steps` is nonempty (a string or array); structured-debugging-debugging-context: `ranked_hypotheses` is nonempty (a string or array); structured-debugging-evidence-receipt: `change_before_reproduction` equals false.
