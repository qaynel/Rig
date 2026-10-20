# testing.property-fuzz.fuzz-input-generation — minimal

Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for fuzz input generation. The minimal boundary for fuzz input generation checks input_seeds (nonempty): input seeds must name the concrete repository contract. Binding checks: fuzz-input-generation-source-code-boundary.

Read a repository-owned command or existing native check that can observe property-fuzz.fuzz-input-generation; bind it to the input named in `rig-services/testing.property-fuzz.fuzz-input-generation.json` and preserve the check's failure status. When adopting this in an existing repository, connect fuzz input generation to the command that inspects input_seeds and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside property-fuzz.fuzz-input-generation as a failure.

Acceptance target: policy:testing.property-fuzz.fuzz-input-generation:minimal:fuzz-input-generation-source-code-boundary.

Declared predicates: fuzz-input-generation-source-code-boundary: `input_seeds` is nonempty (a string or array).
