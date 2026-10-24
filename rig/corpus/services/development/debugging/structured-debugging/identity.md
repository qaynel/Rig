# development.debugging.structured-debugging — identity

Policy grade: structured-debugging owns debugging.structured-debugging. Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Input: `rig-services/development.debugging.structured-debugging.json`. Configuration validation only, so it confirms reproduction steps, ranked hypotheses and the change-before-reproduction flag are declared; it does not show the bug is reproducible.

Disposition: executable.
Acceptance target: policy:development.debugging.structured-debugging:minimal:structured-debugging-source-code-boundary.
Declared predicates: structured-debugging-source-code-boundary: `reproduction_steps` is nonempty (a string or array).
