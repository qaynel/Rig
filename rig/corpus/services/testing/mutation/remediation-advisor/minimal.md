# testing.mutation.remediation-advisor — minimal

Minimal establishes a non-vacuous policy boundary for remediation advisor. It checks remediation_cases (nonempty): remediation cases must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe mutation.remediation-advisor; bind it to the input named in `rig-services/testing.mutation.remediation-advisor.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.remediation-advisor is a failure.

Acceptance target: fixture:testing.mutation.remediation-advisor:policy-boundary. Given source-code is present and mutation.remediation-advisor is selected, pass only when the repository binding evaluates mutation.remediation-advisor and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.
