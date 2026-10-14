# development.code-creation.api-client-generation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for api client generation. It checks specification_path (nonempty): specification path must name the concrete repository contract.. Binding checks: api-client-generation-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe code-creation.api-client-generation; bind it to the input named in `rig-services/development.code-creation.api-client-generation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside code-creation.api-client-generation is a failure.

Acceptance target: fixture:development.code-creation.api-client-generation:policy-boundary. Given source-code is present and code-creation.api-client-generation is selected, pass only when the repository binding evaluates code-creation.api-client-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Owned scope: `code-creation.api-client-generation`.

Offer: Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Input: `rig-services/development.code-creation.api-client-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: api client generation configuration validation only; declared policy does not prove running api client generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: specification path — "openapi.json".

mid: compatibility version — "1.0.0".

maximal: unknown response policy — "fail-explicitly".
