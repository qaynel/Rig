# development.documentation.api-reference — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for api reference; it does not widen ownership beyond documentation.api-reference. For api reference, inspect these context signals: error_responses. Binding checks: api-reference-documentation-context.

Read the existing repository's api reference convention, then name the source path or command that establishes it. For api reference, inspect the repository's actual spec, source, test, or configuration for error_responses; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring documentation services outside the api reference decision for documentation.api-reference.

Acceptance target: fixture:development.documentation.api-reference:repository-context. Given documentation.api-reference has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent documentation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.
minimal: documented endpoints — ["/items"].
mid: error responses — ["400 invalid input"].
maximal: authentication documented — true.
