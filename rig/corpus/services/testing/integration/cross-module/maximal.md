# testing.integration.cross-module — maximal

Maximal adds a replayable evidence receipt for cross module. The evidence must preserve the participating_modules, interaction_cases, stub_internal_contracts inputs that determined the result.

Use a second run against unchanged cross module inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.integration.cross-module:evidence-replay. Given the integration.cross-module binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
