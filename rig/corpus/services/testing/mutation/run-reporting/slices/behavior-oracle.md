# testing.mutation.run-reporting — behavior-oracle slice

Policy grade slice. This slice bounds run reporting to mutation.run-reporting. It uses `run-reporting-slice-behavior-oracle` and checks reported_outcomes (nonempty): reported outcomes must name the concrete repository contract..

For run reporting, choose a repository example that satisfies reported_outcomes at the behavior-oracle floor, plus a failure where reported outcomes must name the concrete repository contract. is false. For run reporting, wire `behavior-oracle` to `rig-services/testing.mutation.run-reporting.json` and keep its verdict on reported_outcomes; missing evidence is a named gap, with ceiling run reporting configuration validation only; declared policy does not prove running run reporting behavior. Choose a repository-owned check that observes run reporting from rig-services/testing.mutation.run-reporting.json..

Service-specific evidence cues:
Offer: Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.
minimal: reported outcomes — ["killed","survived","timeout"].
mid: input revision — "a1b2c3d".
maximal: publish raw secrets — false.
