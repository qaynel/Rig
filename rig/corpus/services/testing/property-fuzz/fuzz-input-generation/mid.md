# testing.property-fuzz.fuzz-input-generation — mid

Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: fuzz-input-generation-source-code-boundary, fuzz-input-generation-property-fuzz-context.

Ground the decision in the existing repository's fuzz input generation convention, then name the source path or command that establishes it. For fuzz input generation, inspect the repository's actual spec, source, test, or configuration for reproduction_seed; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring property-fuzz services outside the fuzz input generation decision for property-fuzz.fuzz-input-generation.

Acceptance target: policy:testing.property-fuzz.fuzz-input-generation:mid:fuzz-input-generation-source-code-boundary+fuzz-input-generation-property-fuzz-context.

Declared predicates: fuzz-input-generation-source-code-boundary: `input_seeds` is nonempty (a string or array); fuzz-input-generation-property-fuzz-context: `reproduction_seed` is numeric and at least 42.
