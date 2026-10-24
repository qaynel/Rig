# development.documentation.api-reference — maximal

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Policy grade, maximal: Authentication must be documented beside each endpoint. Otherwise a protected operation reads as public, so mark which endpoints require credentials. Cumulative with minimal and mid. Binding checks: api-reference-source-code-boundary, api-reference-documentation-context, api-reference-evidence-receipt.
