# testing.mutation.equivalent-mutant-detector — minimal

Minimal establishes a non-vacuous policy boundary for equivalent mutant detector. It checks equivalence_evidence (nonempty): equivalence evidence must name the concrete repository contract..

Read a repository-owned command or existing native check that can observe mutation.equivalent-mutant-detector; bind it to the input named in `rig-services/testing.mutation.equivalent-mutant-detector.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.equivalent-mutant-detector is a failure.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:policy-boundary. Given source-code is present and mutation.equivalent-mutant-detector is selected, pass only when the repository binding evaluates mutation.equivalent-mutant-detector and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.
