# development.code-creation.api-client-generation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for api client generation; it does not widen ownership beyond code-creation.api-client-generation. For api client generation, inspect these context signals: compatibility_version. Binding checks: api-client-generation-code-creation-context.

Inspect the existing repository's api client generation convention, then name the source path or command that establishes it. For api client generation, inspect the repository's actual spec, source, test, or configuration for compatibility_version; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-creation services outside the api client generation decision for code-creation.api-client-generation.

Acceptance target: fixture:development.code-creation.api-client-generation:repository-context. Given code-creation.api-client-generation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.
minimal: specification path — "openapi.json".
mid: compatibility version — "1.0.0".
maximal: unknown response policy — "fail-explicitly".
