# testing.e2e.user-journeys — identity

Policy grade: user-journeys owns e2e.user-journeys. Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Input: `rig-services/testing.e2e.user-journeys.json`. Configuration validation only, so it confirms journeys, observable outcomes and the page-load-only flag are declared; it does not execute a journey.

Disposition: executable.
Acceptance target: policy:testing.e2e.user-journeys:minimal:user-journeys-source-code-boundary.
Declared predicates: user-journeys-source-code-boundary: `journeys` is nonempty (a string or array).
