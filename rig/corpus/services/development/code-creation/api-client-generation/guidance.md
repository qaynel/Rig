# api-client-generation

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Owned scope: `code-creation.api-client-generation`. Input: `rig-services/development.code-creation.api-client-generation.json`.

Coverage ceiling: Configuration validation only, so it confirms the specification path, compatibility version and unknown-response policy are declared; it does not show the generated client matches the live API.

minimal: specification path — "openapi.json". Point to the authoritative API document the client is generated from. Without a path the client can drift from the contract, so declare the specification file.

mid: compatibility version — "1.0.0". Declare the API compatibility version the client targets. Callers cannot tell which contract they rely on otherwise, so record the version string.

maximal: unknown response policy — "fail-explicitly". State how the client treats response variants it does not recognise. Silent acceptance turns schema drift into success, so name the explicit policy such as fail or surface.
