# development.debugging.structured-debugging — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for structured debugging. It checks reproduction_steps (nonempty): reproduction steps must name the concrete repository contract.. Binding checks: structured-debugging-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe debugging.structured-debugging; bind it to the input named in `rig-services/development.debugging.structured-debugging.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside debugging.structured-debugging is a failure.

Acceptance target: fixture:development.debugging.structured-debugging:policy-boundary. Given source-code is present and debugging.structured-debugging is selected, pass only when the repository binding evaluates debugging.structured-debugging and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Owned scope: `debugging.structured-debugging`.

Offer: Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Input: `rig-services/development.debugging.structured-debugging.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Select an approved repository-owned command to verify that behavior.

minimal: reproduction steps — ["run failing case"].

mid: ranked hypotheses — ["invalid input reaches parser"].

maximal: change before reproduction — false.
