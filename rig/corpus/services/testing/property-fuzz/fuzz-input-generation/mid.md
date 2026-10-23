# testing.property-fuzz.fuzz-input-generation — mid

Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Policy grade, mid: Record the reproduction seed, a fixed value such as 42. A discovered failure must be replayable, so keep the seed. Cumulative with minimal. Binding checks: fuzz-input-generation-source-code-boundary, fuzz-input-generation-property-fuzz-context.

Acceptance target: policy:testing.property-fuzz.fuzz-input-generation:mid:fuzz-input-generation-source-code-boundary+fuzz-input-generation-property-fuzz-context.
Declared predicates: fuzz-input-generation-source-code-boundary: `input_seeds` is nonempty (a string or array); fuzz-input-generation-property-fuzz-context: `reproduction_seed` is numeric and at least 42.
