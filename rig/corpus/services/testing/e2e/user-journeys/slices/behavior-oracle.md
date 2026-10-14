# testing.e2e.user-journeys — behavior-oracle slice

Policy grade slice. This slice bounds user journeys to e2e.user-journeys. It uses `user-journeys-slice-behavior-oracle` and checks journeys (nonempty): journeys must name the concrete repository contract..

For user journeys, choose a repository example that satisfies journeys at the behavior-oracle floor, plus a failure where journeys must name the concrete repository contract. is false. For user journeys, wire `behavior-oracle` to `rig-services/testing.e2e.user-journeys.json` and keep its verdict on journeys; missing evidence is a named gap, with ceiling user journeys configuration validation only; declared policy does not prove running user journeys behavior. Choose a repository-owned check that observes user journeys from rig-services/testing.e2e.user-journeys.json..

Service-specific evidence cues:
Offer: Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.
minimal: journeys — ["create and retrieve item"].
mid: observable outcomes — ["item appears after refresh"].
maximal: assert only page loaded — false.
