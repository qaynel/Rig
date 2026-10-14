# testing.mutation.mutant-generator — minimal

Minimal establishes a non-vacuous policy boundary for mutant generator. It checks mutation_operators (nonempty): mutation operators must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe mutation.mutant-generator; bind it to the input named in `rig-services/testing.mutation.mutant-generator.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.mutant-generator is a failure.

Acceptance target: fixture:testing.mutation.mutant-generator:policy-boundary. Given source-code is present and mutation.mutant-generator is selected, pass only when the repository binding evaluates mutation.mutant-generator and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.
