# testing.property-fuzz.fuzz-input-generation — minimal

Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Policy grade, minimal: List the input seeds used. Without a corpus fuzzing starts blind, so name the seed inputs. Binding checks: fuzz-input-generation-source-code-boundary.

Acceptance target: policy:testing.property-fuzz.fuzz-input-generation:minimal:fuzz-input-generation-source-code-boundary.
Declared predicates: fuzz-input-generation-source-code-boundary: `input_seeds` is nonempty (a string or array).
