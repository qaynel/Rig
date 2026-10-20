# development.code-creation.api-client-generation — identity

Policy grade: api client generation owns code-creation.api-client-generation. Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Keep neighboring code-creation services outside the api client generation decision for code-creation.api-client-generation. Start from the configured input at `rig-services/development.code-creation.api-client-generation.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: api client generation configuration validation only; declared policy does not prove running api client generation behavior. Choose a repository-owned check that observes api client generation from rig-services/development.code-creation.api-client-generation.json.

Acceptance target: policy:development.code-creation.api-client-generation:minimal:api-client-generation-source-code-boundary.

Declared predicates: api-client-generation-source-code-boundary: `specification_path` is nonempty (a string or array).
