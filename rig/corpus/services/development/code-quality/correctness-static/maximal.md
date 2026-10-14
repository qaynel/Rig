# development.code-quality.correctness-static — maximal

Maximal adds a replayable evidence receipt for correctness static. The evidence must preserve the analyzer_command, enabled_rules, ignore_analyzer_failure inputs that determined the result.

Inspect a second run against unchanged correctness static inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: correctness static configuration validation only; declared policy does not prove running correctness static behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-quality.correctness-static:evidence-replay. Given the correctness-static-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
