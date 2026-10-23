# development.code-creation.api-client-generation — minimal

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Policy grade, minimal: Point to the authoritative API document the client is generated from. Without a path the client can drift from the contract, so declare the specification file. Binding checks: api-client-generation-source-code-boundary.

Acceptance target: policy:development.code-creation.api-client-generation:minimal:api-client-generation-source-code-boundary.
Declared predicates: api-client-generation-source-code-boundary: `specification_path` is nonempty (a string or array).
