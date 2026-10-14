# testing.property-fuzz.invariant-identification — minimal

Minimal establishes a non-vacuous policy boundary for invariant identification. It checks invariants (nonempty): invariants must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe property-fuzz.invariant-identification; bind it to the input named in `rig-services/testing.property-fuzz.invariant-identification.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside property-fuzz.invariant-identification is a failure.

Acceptance target: fixture:testing.property-fuzz.invariant-identification:policy-boundary. Given source-code is present and property-fuzz.invariant-identification is selected, pass only when the repository binding evaluates property-fuzz.invariant-identification and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern. A passing policy check does not establish runtime behavior.
