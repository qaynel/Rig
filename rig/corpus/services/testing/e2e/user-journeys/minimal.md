# testing.e2e.user-journeys — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for user journeys. The minimal boundary for user journeys checks journeys (nonempty): journeys must name the concrete repository contract.. Binding checks: user-journeys-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe e2e.user-journeys; bind it to the input named in `rig-services/testing.e2e.user-journeys.json` and preserve the check's failure status. When adopting this in an existing repository, connect user journeys to the command that inspects journeys and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside e2e.user-journeys as a failure.

Acceptance target: fixture:testing.e2e.user-journeys:policy-boundary. Given source-code is present and e2e.user-journeys is selected, pass only when the repository binding evaluates e2e.user-journeys and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern. The ceiling is user journeys configuration validation only; declared policy does not prove running user journeys behavior. Choose a repository-owned check that observes user journeys from rig-services/testing.e2e.user-journeys.json..

Service-specific evidence cues:
Offer: Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.
minimal: journeys — ["create and retrieve item"].
mid: observable outcomes — ["item appears after refresh"].
maximal: assert only page loaded — false.
