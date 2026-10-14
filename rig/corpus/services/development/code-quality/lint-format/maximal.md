# development.code-quality.lint-format — maximal

Maximal adds a replayable evidence receipt for lint format. The evidence must preserve the format_command, lint_command, autofix_during_check inputs that determined the result.

Anchor the review on a second run against unchanged lint format inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: lint format configuration validation only; declared policy does not prove running lint format behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-quality.lint-format:evidence-replay. Given the development.code-quality.lint-format binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
