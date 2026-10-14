# development.debugging.structured-debugging — identity

structured debugging owns debugging.structured-debugging. Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Keep sibling services in debugging under their own verdicts. Start from the configured input at `rig-services/development.debugging.structured-debugging.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.debugging.structured-debugging:policy-boundary. Given source-code is present and debugging.structured-debugging is selected, pass only when the repository binding evaluates debugging.structured-debugging and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern.
