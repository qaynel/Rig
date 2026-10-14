# development.code-creation.api-client-generation — behavior-oracle slice

Policy grade slice. This slice bounds api client generation to code-creation.api-client-generation. It uses `api-client-generation-slice-behavior-oracle` and checks specification_path (nonempty): specification path must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-creation.api-client-generation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than api client generation configuration validation only; declared policy does not prove running api client generation behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Owned scope: `code-creation.api-client-generation`.

Offer: Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Input: `rig-services/development.code-creation.api-client-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: api client generation configuration validation only; declared policy does not prove running api client generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: specification path — "openapi.json".

mid: compatibility version — "1.0.0".

maximal: unknown response policy — "fail-explicitly".
