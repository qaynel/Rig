# development.documentation.api-reference — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for api reference. The evidence must preserve the documented_endpoints, error_responses, authentication_documented inputs that determined the result. Binding checks: api-reference-evidence-receipt.

Ground the decision in a second run against unchanged api reference inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: api reference configuration validation only; declared policy does not prove running api reference behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.documentation.api-reference:evidence-replay. Given the documentation.api-reference binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Owned scope: `documentation.api-reference`.

Offer: Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Input: `rig-services/development.documentation.api-reference.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: api reference configuration validation only; declared policy does not prove running api reference behavior. Select an approved repository-owned command to verify that behavior.

minimal: documented endpoints — ["/items"].

mid: error responses — ["400 invalid input"].

maximal: authentication documented — true.
