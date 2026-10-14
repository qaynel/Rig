# development.debugging.structured-debugging — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for structured debugging. The minimal boundary for structured debugging checks reproduction_steps (nonempty): reproduction steps must name the concrete repository contract.. Binding checks: structured-debugging-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe debugging.structured-debugging; bind it to the input named in `rig-services/development.debugging.structured-debugging.json` and preserve the check's failure status. When adopting this in an existing repository, connect structured debugging to the command that inspects reproduction_steps and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside debugging.structured-debugging as a failure.

Acceptance target: fixture:development.debugging.structured-debugging:policy-boundary. Given source-code is present and debugging.structured-debugging is selected, pass only when the repository binding evaluates debugging.structured-debugging and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern. The ceiling is structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Choose a repository-owned check that observes structured debugging from rig-services/development.debugging.structured-debugging.json..

Service-specific evidence cues:
Offer: Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.
minimal: reproduction steps — ["run failing case"].
mid: ranked hypotheses — ["invalid input reaches parser"].
maximal: change before reproduction — false.
