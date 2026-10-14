# testing.mutation.remediation-advisor — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for remediation advisor. The minimal boundary for remediation advisor checks remediation_cases (nonempty): remediation cases must name the concrete repository contract.. Binding checks: remediation-advisor-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe mutation.remediation-advisor; bind it to the input named in `rig-services/testing.mutation.remediation-advisor.json` and preserve the check's failure status. When adopting this in an existing repository, connect remediation advisor to the command that inspects remediation_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside mutation.remediation-advisor as a failure.

Acceptance target: fixture:testing.mutation.remediation-advisor:policy-boundary. Given source-code is present and mutation.remediation-advisor is selected, pass only when the repository binding evaluates mutation.remediation-advisor and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. The ceiling is remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Choose a repository-owned check that observes remediation advisor from rig-services/testing.mutation.remediation-advisor.json..

Service-specific evidence cues:
Offer: Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.
minimal: remediation cases — ["reject exact upper limit"].
mid: target behaviors — ["limit enforcement"].
maximal: add implementation mirrors — false.
