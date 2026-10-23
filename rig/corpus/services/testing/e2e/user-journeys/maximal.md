# testing.e2e.user-journeys — maximal

Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Policy grade, maximal: Set asserting only that the page loaded to false. A loading page does not prove the requested outcome happened, so assert the resulting state. Cumulative with minimal and mid. Binding checks: user-journeys-source-code-boundary, user-journeys-e2e-context, user-journeys-evidence-receipt.

Acceptance target: policy:testing.e2e.user-journeys:maximal:user-journeys-source-code-boundary+user-journeys-e2e-context+user-journeys-evidence-receipt.
Declared predicates: user-journeys-source-code-boundary: `journeys` is nonempty (a string or array); user-journeys-e2e-context: `observable_outcomes` is nonempty (a string or array); user-journeys-evidence-receipt: `assert_only_page_loaded` equals false.
