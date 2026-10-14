# testing.mutation.survivor-rca — minimal

Minimal establishes a non-vacuous policy boundary for survivor rca. It checks surviving_mutants (nonempty): surviving mutants must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe mutation.survivor-rca; bind it to the input named in `rig-services/testing.mutation.survivor-rca.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.survivor-rca is a failure.

Acceptance target: fixture:testing.mutation.survivor-rca:policy-boundary. Given source-code is present and mutation.survivor-rca is selected, pass only when the repository binding evaluates mutation.survivor-rca and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.
