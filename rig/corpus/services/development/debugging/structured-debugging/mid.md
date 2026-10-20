# development.debugging.structured-debugging — mid

Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Policy grade, mid: Rank the hypotheses by evidence, each with the experiment that separates it. An unranked list invites guessing, so order them and name the discriminating test. Cumulative with minimal. Binding checks: structured-debugging-source-code-boundary, structured-debugging-debugging-context.

Acceptance target: policy:development.debugging.structured-debugging:mid:structured-debugging-source-code-boundary+structured-debugging-debugging-context.
Declared predicates: structured-debugging-source-code-boundary: `reproduction_steps` is nonempty (a string or array); structured-debugging-debugging-context: `ranked_hypotheses` is nonempty (a string or array).
