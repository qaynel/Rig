# development.data-schema.schema-evolution — maximal

Maximal adds a replayable evidence receipt for schema evolution. The evidence must preserve the compatible_readers, unknown_field_policy, remove_required_fields inputs that determined the result.

Use a second run against unchanged schema evolution inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.data-schema.schema-evolution:evidence-replay. Given the data-schema.schema-evolution binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
