# development.code-quality.typecheck — maximal

Maximal adds a replayable evidence receipt for typecheck. The evidence must preserve the typecheck_command, checked_components, ignore_type_errors inputs that determined the result.

Trace the verdict to a second run against unchanged typecheck inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-quality.typecheck:evidence-replay. Given the code-quality.typecheck binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
