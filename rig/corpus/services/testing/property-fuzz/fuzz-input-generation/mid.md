# testing.property-fuzz.fuzz-input-generation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for fuzz input generation; it does not widen ownership beyond property-fuzz.fuzz-input-generation. For fuzz input generation, inspect these context signals: reproduction_seed. Binding checks: fuzz-input-generation-property-fuzz-context.

Ground the decision in the existing repository's fuzz input generation convention, then name the source path or command that establishes it. For fuzz input generation, inspect the repository's actual spec, source, test, or configuration for reproduction_seed; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring property-fuzz services outside the fuzz input generation decision for property-fuzz.fuzz-input-generation.

Acceptance target: fixture:testing.property-fuzz.fuzz-input-generation:repository-context. Given property-fuzz.fuzz-input-generation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent property fuzz concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.
minimal: input seeds — ["empty","unicode","truncated"].
mid: reproduction seed — 42.
maximal: unbounded input size — false.
