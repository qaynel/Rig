# testing.e2e.user-journeys — floor and mutation-floor slice

Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Policy grade slice. This slice bounds user journeys to e2e.user-journeys. It uses `user-journeys-slice-floor` and checks journeys (nonempty): journeys must name the concrete repository contract.