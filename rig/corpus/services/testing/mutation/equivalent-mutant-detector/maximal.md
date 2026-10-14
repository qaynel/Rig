# testing.mutation.equivalent-mutant-detector — maximal

Maximal adds a replayable evidence receipt for equivalent mutant detector. The evidence must preserve the equivalence_evidence, review_owners, classify_by_survival_only inputs that determined the result.

Use a second run against unchanged equivalent mutant detector inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:evidence-replay. Given the mutation.equivalent-mutant-detector binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
