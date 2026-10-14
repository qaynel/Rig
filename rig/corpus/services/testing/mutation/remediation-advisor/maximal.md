# testing.mutation.remediation-advisor — maximal

Maximal adds a replayable evidence receipt for remediation advisor. The evidence must preserve the remediation_cases, target_behaviors, add_implementation_mirrors inputs that determined the result.

Inspect a second run against unchanged remediation advisor inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.remediation-advisor:evidence-replay. Given the mutation.remediation-advisor binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
