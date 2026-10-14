# testing.property-fuzz.fuzz-input-generation — minimal

Minimal establishes a non-vacuous policy boundary for fuzz input generation. It checks input_seeds (nonempty): input seeds must name the concrete repository contract..

Read a repository-owned command or existing native check that can observe property-fuzz.fuzz-input-generation; bind it to the input named in `rig-services/testing.property-fuzz.fuzz-input-generation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside property-fuzz.fuzz-input-generation is a failure.

Acceptance target: fixture:testing.property-fuzz.fuzz-input-generation:policy-boundary. Given source-code is present and property-fuzz.fuzz-input-generation is selected, pass only when the repository binding evaluates property-fuzz.fuzz-input-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern. A passing policy check does not establish runtime behavior.
