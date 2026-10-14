# testing.mutation.language-adapter — maximal

Maximal adds a replayable evidence receipt for language adapter. The evidence must preserve the source_extensions, compiler_command, parse_errors_are_success inputs that determined the result.

Tie acceptance to a second run against unchanged language adapter inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.language-adapter:evidence-replay. Given the mutation.language-adapter binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
