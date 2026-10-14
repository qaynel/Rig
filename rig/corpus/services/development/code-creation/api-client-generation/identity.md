# development.code-creation.api-client-generation — identity

Policy grade: api client generation owns code-creation.api-client-generation. Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Keep sibling services in code-creation under their own verdicts. Start from the configured input at `rig-services/development.code-creation.api-client-generation.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: api client generation configuration validation only; declared policy does not prove running api client generation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.api-client-generation:policy-boundary. Given source-code is present and code-creation.api-client-generation is selected, pass only when the repository binding evaluates code-creation.api-client-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern.

Service-specific evidence cues:
Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Owned scope: `code-creation.api-client-generation`.

Offer: Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Input: `rig-services/development.code-creation.api-client-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: api client generation configuration validation only; declared policy does not prove running api client generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: specification path — "openapi.json".

mid: compatibility version — "1.0.0".

maximal: unknown response policy — "fail-explicitly".
