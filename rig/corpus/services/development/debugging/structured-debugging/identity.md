# development.debugging.structured-debugging — identity

Policy grade: structured debugging owns debugging.structured-debugging. Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Keep neighboring debugging services outside the structured debugging decision for debugging.structured-debugging. Start from the configured input at `rig-services/development.debugging.structured-debugging.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Choose a repository-owned check that observes structured debugging from rig-services/development.debugging.structured-debugging.json.

Acceptance target: policy:development.debugging.structured-debugging:minimal:structured-debugging-source-code-boundary.

Declared predicates: structured-debugging-source-code-boundary: `reproduction_steps` is nonempty (a string or array).
