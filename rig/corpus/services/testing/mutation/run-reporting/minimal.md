# testing.mutation.run-reporting — minimal

Minimal establishes a non-vacuous policy boundary for run reporting. It checks reported_outcomes (nonempty): reported outcomes must name the concrete repository contract..

Ground the decision in a repository-owned command or existing native check that can observe mutation.run-reporting; bind it to the input named in `rig-services/testing.mutation.run-reporting.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.run-reporting is a failure.

Acceptance target: fixture:testing.mutation.run-reporting:policy-boundary. Given source-code is present and mutation.run-reporting is selected, pass only when the repository binding evaluates mutation.run-reporting and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.
