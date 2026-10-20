# testing.e2e.user-journeys — mid

Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: user-journeys-source-code-boundary, user-journeys-e2e-context.

Acceptance target: policy:testing.e2e.user-journeys:mid:user-journeys-source-code-boundary+user-journeys-e2e-context.

Declared predicates: user-journeys-source-code-boundary: `journeys` is nonempty (a string or array); user-journeys-e2e-context: `observable_outcomes` is nonempty (a string or array).
