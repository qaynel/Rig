# development.code-creation.api-client-generation — mid

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: api-client-generation-source-code-boundary, api-client-generation-code-creation-context.

Inspect the existing repository's api client generation convention, then name the source path or command that establishes it. For api client generation, inspect the repository's actual spec, source, test, or configuration for compatibility_version; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-creation services outside the api client generation decision for code-creation.api-client-generation.

Acceptance target: policy:development.code-creation.api-client-generation:mid:api-client-generation-source-code-boundary+api-client-generation-code-creation-context.

Declared predicates: api-client-generation-source-code-boundary: `specification_path` is nonempty (a string or array); api-client-generation-code-creation-context: `compatibility_version` is nonempty (a string or array).
