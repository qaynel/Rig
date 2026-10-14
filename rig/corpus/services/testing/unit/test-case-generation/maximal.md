# testing.unit.test-case-generation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for test case generation. The evidence must preserve the behavior_cases, asserted_outcomes, assert_implementation_details inputs that determined the result. Binding checks: test-case-generation-evidence-receipt.

Read a second run against unchanged test case generation inputs. Record the behavior_cases, asserted_outcomes, assert_implementation_details inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this test case generation result is stale. The ceiling remains: test case generation configuration validation only; declared policy does not prove running test case generation behavior. Choose a repository-owned check that observes test case generation from rig-services/testing.unit.test-case-generation.json.

Acceptance target: fixture:testing.unit.test-case-generation:evidence-replay. Given the unit.test-case-generation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.
minimal: behavior cases — ["reject malformed input"].
mid: asserted outcomes — ["throws invalid record"].
maximal: assert implementation details — false.
