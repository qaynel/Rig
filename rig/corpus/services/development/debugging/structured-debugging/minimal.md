# development.debugging.structured-debugging — minimal

Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for structured debugging. The minimal boundary for structured debugging checks reproduction_steps (nonempty): reproduction steps must name the concrete repository contract. Binding checks: structured-debugging-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe debugging.structured-debugging; bind it to the input named in `rig-services/development.debugging.structured-debugging.json` and preserve the check's failure status. When adopting this in an existing repository, connect structured debugging to the command that inspects reproduction_steps and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside debugging.structured-debugging as a failure.

Acceptance target: policy:development.debugging.structured-debugging:minimal:structured-debugging-source-code-boundary.

Declared predicates: structured-debugging-source-code-boundary: `reproduction_steps` is nonempty (a string or array).
