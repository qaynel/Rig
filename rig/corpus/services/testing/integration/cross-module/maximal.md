# testing.integration.cross-module — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for cross module. The evidence must preserve the participating_modules, interaction_cases, stub_internal_contracts inputs that determined the result. Binding checks: cross-module-evidence-receipt.

Use a second run against unchanged cross module inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.integration.cross-module:evidence-replay. Given the integration.cross-module binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Owned scope: `integration.cross-module`.

Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Input: `rig-services/testing.integration.cross-module.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

minimal: participating modules — ["orders","inventory"].

mid: interaction cases — ["order reserves stock"].

maximal: stub internal contracts — false.
