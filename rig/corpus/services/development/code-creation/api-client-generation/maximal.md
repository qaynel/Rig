# development.code-creation.api-client-generation — maximal

Maximal adds a replayable evidence receipt for api client generation. The evidence must preserve the specification_path, compatibility_version, unknown_response_policy inputs that determined the result.

Tie acceptance to a second run against unchanged api client generation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: api client generation configuration validation only; declared policy does not prove running api client generation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.api-client-generation:evidence-replay. Given the code-creation.api-client-generation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
