# development.debugging.structured-debugging — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for structured debugging; it does not widen ownership beyond debugging.structured-debugging. The context signals are ranked_hypotheses. Binding checks: structured-debugging-debugging-context.

Inspect the existing repository's structured debugging convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in debugging under their own verdicts.

Acceptance target: fixture:development.debugging.structured-debugging:repository-context. Given debugging.structured-debugging has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent debugging concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Owned scope: `debugging.structured-debugging`.

Offer: Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Input: `rig-services/development.debugging.structured-debugging.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Select an approved repository-owned command to verify that behavior.

minimal: reproduction steps — ["run failing case"].

mid: ranked hypotheses — ["invalid input reaches parser"].

maximal: change before reproduction — false.
