# testing.mutation.mutant-generator — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for mutant generator. The evidence must preserve the mutation_operators, target_paths, mutate_test_code inputs that determined the result. Binding checks: mutant-generator-evidence-receipt.

Inspect a second run against unchanged mutant generator inputs. Record the mutation_operators, target_paths, mutate_test_code inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this mutant generator result is stale. The ceiling remains: mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Choose a repository-owned check that observes mutant generator from rig-services/testing.mutation.mutant-generator.json.

Acceptance target: fixture:testing.mutation.mutant-generator:evidence-replay. Given the mutation.mutant-generator binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.
minimal: mutation operators — ["negate conditional"].
mid: target paths — ["src/parser.js"].
maximal: mutate test code — false.
