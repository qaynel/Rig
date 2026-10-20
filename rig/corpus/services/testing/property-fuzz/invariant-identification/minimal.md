# testing.property-fuzz.invariant-identification — minimal

State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for invariant identification. The minimal boundary for invariant identification checks invariants (nonempty): invariants must name the concrete repository contract. Binding checks: invariant-identification-source-code-boundary.

Use a repository-owned command or existing native check that can observe property-fuzz.invariant-identification; bind it to the input named in `rig-services/testing.property-fuzz.invariant-identification.json` and preserve the check's failure status. When adopting this in an existing repository, connect invariant identification to the command that inspects invariants and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside property-fuzz.invariant-identification as a failure.

Acceptance target: policy:testing.property-fuzz.invariant-identification:minimal:invariant-identification-source-code-boundary.

Declared predicates: invariant-identification-source-code-boundary: `invariants` is nonempty (a string or array).
