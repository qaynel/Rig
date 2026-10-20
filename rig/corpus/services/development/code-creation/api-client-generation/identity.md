# development.code-creation.api-client-generation — identity

Policy grade: api-client-generation owns code-creation.api-client-generation. Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Input: `rig-services/development.code-creation.api-client-generation.json`. Configuration validation only, so it confirms the specification path, compatibility version and unknown-response policy are declared; it does not show the generated client matches the live API.

Disposition: executable.
Acceptance target: policy:development.code-creation.api-client-generation:minimal:api-client-generation-source-code-boundary.
Declared predicates: api-client-generation-source-code-boundary: `specification_path` is nonempty (a string or array).
