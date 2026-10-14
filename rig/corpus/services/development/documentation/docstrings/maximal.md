# development.documentation.docstrings — maximal

Maximal adds a replayable evidence receipt for docstrings. The evidence must preserve the documented_symbols, parameters, failure_contract inputs that determined the result.

Read a second run against unchanged docstrings inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: docstrings configuration validation only; declared policy does not prove running docstrings behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.documentation.docstrings:evidence-replay. Given the documentation.docstrings binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
