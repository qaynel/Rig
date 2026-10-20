# testing.property-fuzz.fuzz-input-generation — maximal

Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Policy grade, maximal: Set unbounded input size to false. Unbounded inputs exhaust resources, so cap size. Cumulative with minimal and mid. Binding checks: fuzz-input-generation-source-code-boundary, fuzz-input-generation-property-fuzz-context, fuzz-input-generation-evidence-receipt.

Acceptance target: policy:testing.property-fuzz.fuzz-input-generation:maximal:fuzz-input-generation-source-code-boundary+fuzz-input-generation-property-fuzz-context+fuzz-input-generation-evidence-receipt.
Declared predicates: fuzz-input-generation-source-code-boundary: `input_seeds` is nonempty (a string or array); fuzz-input-generation-property-fuzz-context: `reproduction_seed` is numeric and at least 42; fuzz-input-generation-evidence-receipt: `unbounded_input_size` equals false.
