# development.code-creation.api-client-generation — mid

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Policy grade, mid: Declare the API compatibility version the client targets. Callers cannot tell which contract they rely on otherwise, so record the version string. Cumulative with minimal. Binding checks: api-client-generation-source-code-boundary, api-client-generation-code-creation-context.

Acceptance target: policy:development.code-creation.api-client-generation:mid:api-client-generation-source-code-boundary+api-client-generation-code-creation-context.
Declared predicates: api-client-generation-source-code-boundary: `specification_path` is nonempty (a string or array); api-client-generation-code-creation-context: `compatibility_version` is nonempty (a string or array).
