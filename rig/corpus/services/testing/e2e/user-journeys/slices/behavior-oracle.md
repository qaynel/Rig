# testing.e2e.user-journeys — behavior-oracle slice

Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Policy grade slice `user-journeys-slice-behavior-oracle`: Name the user journeys covered end to end. Untracked journeys are untested, so list each one. Despite its name this slice is not a behavior oracle: it confirms journeys, observable outcomes and the page-load-only flag are declared; it does not execute a journey.
