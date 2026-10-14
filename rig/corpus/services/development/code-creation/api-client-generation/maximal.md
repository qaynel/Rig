# development.code-creation.api-client-generation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for api client generation. The evidence must preserve the specification_path, compatibility_version, unknown_response_policy inputs that determined the result. Binding checks: api-client-generation-evidence-receipt.

Tie acceptance to a second run against unchanged api client generation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: api client generation configuration validation only; declared policy does not prove running api client generation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.api-client-generation:evidence-replay. Given the code-creation.api-client-generation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Owned scope: `code-creation.api-client-generation`.

Offer: Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Input: `rig-services/development.code-creation.api-client-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: api client generation configuration validation only; declared policy does not prove running api client generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: specification path — "openapi.json".

mid: compatibility version — "1.0.0".

maximal: unknown response policy — "fail-explicitly".
