# testing.property-fuzz.fuzz-input-generation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for fuzz input generation; it does not widen ownership beyond property-fuzz.fuzz-input-generation. The context signals are reproduction_seed. Binding checks: fuzz-input-generation-property-fuzz-context.

Ground the decision in the existing repository's fuzz input generation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in property-fuzz under their own verdicts.

Acceptance target: fixture:testing.property-fuzz.fuzz-input-generation:repository-context. Given property-fuzz.fuzz-input-generation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent property fuzz concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Owned scope: `property-fuzz.fuzz-input-generation`.

Offer: Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Input: `rig-services/testing.property-fuzz.fuzz-input-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: input seeds — ["empty","unicode","truncated"].

mid: reproduction seed — 42.

maximal: unbounded input size — false.
