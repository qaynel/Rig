# development.documentation.api-reference — minimal

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Grade: minimal. Assurance remains Policy grade. The native check `api-reference-source-code-boundary` evaluates `documented_endpoints` nonempty. Example: `documented_endpoints` = ["/items"].

Endpoint and error lists identify intended documentation coverage; the authentication flag records that authentication is meant to be documented. The rules do not inspect any API specification.

Catalogue policy target: `policy:development.documentation.api-reference:minimal:api-reference-source-code-boundary`. It describes the policy condition; this service does not include a separate fixture for it. Native checks require nonempty endpoint and error-response lists and authentication_documented=true in the JSON policy. They do not compare an API reference with the implemented public contract.
