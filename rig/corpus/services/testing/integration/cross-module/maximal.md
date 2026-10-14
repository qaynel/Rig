# testing.integration.cross-module — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for cross module. The evidence must preserve the participating_modules, interaction_cases, stub_internal_contracts inputs that determined the result. Binding checks: cross-module-evidence-receipt.

Use a second run against unchanged cross module inputs. Record the participating_modules, interaction_cases, stub_internal_contracts inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this cross module result is stale. The ceiling remains: cross module configuration validation only; declared policy does not prove running cross module behavior. Choose a repository-owned check that observes cross module from rig-services/testing.integration.cross-module.json.

Acceptance target: fixture:testing.integration.cross-module:evidence-replay. Given the integration.cross-module binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.
minimal: participating modules — ["orders","inventory"].
mid: interaction cases — ["order reserves stock"].
maximal: stub internal contracts — false.
