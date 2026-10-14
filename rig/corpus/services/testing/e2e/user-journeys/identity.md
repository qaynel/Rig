# testing.e2e.user-journeys — identity

user journeys owns e2e.user-journeys. Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Keep sibling services in e2e under their own verdicts. Use the configured input at `rig-services/testing.e2e.user-journeys.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.e2e.user-journeys:policy-boundary. Given source-code is present and e2e.user-journeys is selected, pass only when the repository binding evaluates e2e.user-journeys and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern.
