# testing.e2e.user-journeys — minimal

Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for user journeys. The minimal boundary for user journeys checks journeys (nonempty): journeys must name the concrete repository contract. Binding checks: user-journeys-source-code-boundary.

Acceptance target: policy:testing.e2e.user-journeys:minimal:user-journeys-source-code-boundary.

Declared predicates: user-journeys-source-code-boundary: `journeys` is nonempty (a string or array).
