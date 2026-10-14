# testing.mutation.mutant-generator — maximal

Maximal adds a replayable evidence receipt for mutant generator. The evidence must preserve the mutation_operators, target_paths, mutate_test_code inputs that determined the result.

Inspect a second run against unchanged mutant generator inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.mutant-generator:evidence-replay. Given the mutation.mutant-generator binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
