# testing.e2e.user-journeys — maximal

Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: user-journeys-source-code-boundary, user-journeys-e2e-context, user-journeys-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.e2e.user-journeys:maximal:user-journeys-source-code-boundary+user-journeys-e2e-context+user-journeys-evidence-receipt.

Declared predicates: user-journeys-source-code-boundary: `journeys` is nonempty (a string or array); user-journeys-e2e-context: `observable_outcomes` is nonempty (a string or array); user-journeys-evidence-receipt: `assert_only_page_loaded` equals false.
