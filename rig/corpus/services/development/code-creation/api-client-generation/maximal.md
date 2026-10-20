# development.code-creation.api-client-generation — maximal

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Policy grade, maximal: State how the client treats response variants it does not recognise. Silent acceptance turns schema drift into success, so name the explicit policy such as fail or surface. Cumulative with minimal and mid. Binding checks: api-client-generation-source-code-boundary, api-client-generation-code-creation-context, api-client-generation-evidence-receipt.

Acceptance target: policy:development.code-creation.api-client-generation:maximal:api-client-generation-source-code-boundary+api-client-generation-code-creation-context+api-client-generation-evidence-receipt.
Declared predicates: api-client-generation-source-code-boundary: `specification_path` is nonempty (a string or array); api-client-generation-code-creation-context: `compatibility_version` is nonempty (a string or array); api-client-generation-evidence-receipt: `unknown_response_policy` is nonempty (a string or array).
