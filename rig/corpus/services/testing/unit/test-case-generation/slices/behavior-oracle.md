# testing.unit.test-case-generation — behavior-oracle slice

Policy grade slice. This slice bounds test case generation to unit.test-case-generation. It uses `test-case-generation-slice-behavior-oracle` and checks behavior_cases (nonempty): behavior cases must name the concrete repository contract..

For test case generation, choose a repository example that satisfies behavior_cases at the behavior-oracle floor, plus a failure where behavior cases must name the concrete repository contract. is false. For test case generation, wire `behavior-oracle` to `rig-services/testing.unit.test-case-generation.json` and keep its verdict on behavior_cases; missing evidence is a named gap, with ceiling test case generation configuration validation only; declared policy does not prove running test case generation behavior. Choose a repository-owned check that observes test case generation from rig-services/testing.unit.test-case-generation.json..

Service-specific evidence cues:
Offer: Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.
minimal: behavior cases — ["reject malformed input"].
mid: asserted outcomes — ["throws invalid record"].
maximal: assert implementation details — false.
