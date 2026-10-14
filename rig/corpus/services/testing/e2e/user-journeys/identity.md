# testing.e2e.user-journeys — identity

Policy grade: user journeys owns e2e.user-journeys. Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Keep neighboring e2e services outside the user journeys decision for e2e.user-journeys. Use the configured input at `rig-services/testing.e2e.user-journeys.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Choose a repository-owned check that observes user journeys from rig-services/testing.e2e.user-journeys.json.

Acceptance target: fixture:testing.e2e.user-journeys:policy-boundary. Given source-code is present and e2e.user-journeys is selected, pass only when the repository binding evaluates e2e.user-journeys and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern.

Service-specific evidence cues:
Offer: Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.
minimal: journeys — ["create and retrieve item"].
mid: observable outcomes — ["item appears after refresh"].
maximal: assert only page loaded — false.
