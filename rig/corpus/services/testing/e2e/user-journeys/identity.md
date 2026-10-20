# testing.e2e.user-journeys — identity

Policy grade: user journeys owns e2e.user-journeys. Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Keep neighboring e2e services outside the user journeys decision for e2e.user-journeys. Use the configured input at `rig-services/testing.e2e.user-journeys.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Choose a repository-owned check that observes user journeys from rig-services/testing.e2e.user-journeys.json.

Acceptance target: policy:testing.e2e.user-journeys:minimal:user-journeys-source-code-boundary.

Declared predicates: user-journeys-source-code-boundary: `journeys` is nonempty (a string or array).
