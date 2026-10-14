# development.data-schema.schema-evolution — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for schema evolution. The evidence must preserve the compatible_readers, unknown_field_policy, remove_required_fields inputs that determined the result. Binding checks: schema-evolution-evidence-receipt.

Use a second run against unchanged schema evolution inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.data-schema.schema-evolution:evidence-replay. Given the data-schema.schema-evolution binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Owned scope: `data-schema.schema-evolution`.

Offer: Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Input: `rig-services/development.data-schema.schema-evolution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.

minimal: compatible readers — ["v1","v2"].

mid: unknown field policy — "ignore-additive-fields".

maximal: remove required fields — false.
