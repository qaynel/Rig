# testing.mutation.run-reporting — maximal

Maximal adds a replayable evidence receipt for run reporting. The evidence must preserve the reported_outcomes, input_revision, publish_raw_secrets inputs that determined the result.

Start from a second run against unchanged run reporting inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.run-reporting:evidence-replay. Given the mutation.run-reporting binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
