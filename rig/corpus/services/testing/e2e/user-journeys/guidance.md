# user-journeys

Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Owned scope: `e2e.user-journeys`. Input: `rig-services/testing.e2e.user-journeys.json`.

Coverage ceiling: Configuration validation only, so it confirms journeys, observable outcomes and the page-load-only flag are declared; it does not execute a journey.

minimal: journeys — ["create and retrieve item"]. Name the user journeys covered end to end. Untracked journeys are untested, so list each one.

mid: observable outcomes — ["item appears after refresh"]. State the observable outcome that ends each journey, such as a stored record. Without it success is assumed, so write what must be true afterwards.

maximal: assert only page loaded — false. Set asserting only that the page loaded to false. A loading page does not prove the requested outcome happened, so assert the resulting state.
