# development.code-creation.api-client-generation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for api client generation. The minimal boundary for api client generation checks specification_path (nonempty): specification path must name the concrete repository contract.. Binding checks: api-client-generation-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe code-creation.api-client-generation; bind it to the input named in `rig-services/development.code-creation.api-client-generation.json` and preserve the check's failure status. When adopting this in an existing repository, connect api client generation to the command that inspects specification_path and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-creation.api-client-generation as a failure.

Acceptance target: fixture:development.code-creation.api-client-generation:policy-boundary. Given source-code is present and code-creation.api-client-generation is selected, pass only when the repository binding evaluates code-creation.api-client-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. The ceiling is api client generation configuration validation only; declared policy does not prove running api client generation behavior. Choose a repository-owned check that observes api client generation from rig-services/development.code-creation.api-client-generation.json..

Service-specific evidence cues:
Offer: Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.
minimal: specification path — "openapi.json".
mid: compatibility version — "1.0.0".
maximal: unknown response policy — "fail-explicitly".
