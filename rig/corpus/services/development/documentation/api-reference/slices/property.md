# development.documentation.api-reference — property-floor slice

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Policy grade. `api-reference-slice-property-floor` requires a nonempty `documented_endpoints` field; it does not exercise endpoint behavior.

The public contract includes endpoint paths, response schemas, error cases, and authentication boundaries. This check validates none of those details beyond presence of a configured endpoint entry.
