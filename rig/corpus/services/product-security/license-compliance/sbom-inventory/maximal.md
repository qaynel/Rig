# product-security.license-compliance.sbom-inventory — maximal

Maximal adds a replayable evidence receipt for sbom inventory. The evidence must preserve the sbom_format, components, omit_dependency_versions inputs that determined the result.

Ground the decision in a second run against unchanged sbom inventory inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.sbom-inventory:evidence-replay. Given the license-compliance.sbom-inventory binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
