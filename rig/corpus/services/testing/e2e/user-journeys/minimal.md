# testing.e2e.user-journeys — minimal

Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Policy grade, minimal: Name the user journeys covered end to end. Untracked journeys are untested, so list each one. Binding checks: user-journeys-source-code-boundary.

Acceptance target: policy:testing.e2e.user-journeys:minimal:user-journeys-source-code-boundary.
Declared predicates: user-journeys-source-code-boundary: `journeys` is nonempty (a string or array).
