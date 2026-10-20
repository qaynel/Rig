# development.debugging.structured-debugging — mid

Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: structured-debugging-source-code-boundary, structured-debugging-debugging-context.

Inspect the existing repository's structured debugging convention, then name the source path or command that establishes it. For structured debugging, inspect the repository's actual spec, source, test, or configuration for ranked_hypotheses; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring debugging services outside the structured debugging decision for debugging.structured-debugging.

Acceptance target: policy:development.debugging.structured-debugging:mid:structured-debugging-source-code-boundary+structured-debugging-debugging-context.

Declared predicates: structured-debugging-source-code-boundary: `reproduction_steps` is nonempty (a string or array); structured-debugging-debugging-context: `ranked_hypotheses` is nonempty (a string or array).
