# development.code-creation.api-client-generation — identity

Policy grade: api client generation owns code-creation.api-client-generation. Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Keep neighboring code-creation services outside the api client generation decision for code-creation.api-client-generation. Start from the configured input at `rig-services/development.code-creation.api-client-generation.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: api client generation configuration validation only; declared policy does not prove running api client generation behavior. Choose a repository-owned check that observes api client generation from rig-services/development.code-creation.api-client-generation.json.

Acceptance target: fixture:development.code-creation.api-client-generation:policy-boundary. Given source-code is present and code-creation.api-client-generation is selected, pass only when the repository binding evaluates code-creation.api-client-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern.

Service-specific evidence cues:
Offer: Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.
minimal: specification path — "openapi.json".
mid: compatibility version — "1.0.0".
maximal: unknown response policy — "fail-explicitly".
