# product-security.secrets.precommit-leak-scanner — maximal

Maximal adds a replayable evidence receipt for precommit leak scanner. The evidence must preserve the scanner_command, scan_scope, ignore_scanner_exit inputs that determined the result.

Tie acceptance to a second run against unchanged precommit leak scanner inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:evidence-replay. Given the secrets.precommit-leak-scanner binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
