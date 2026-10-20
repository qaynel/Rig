# development.documentation.api-reference — mid

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: api-reference-source-code-boundary, api-reference-documentation-context.

Compare endpoints, response errors, and authentication requirements with the repository’s routes or OpenAPI contract. The example values are illustrative and are not evidence of the actual API. A nonempty policy value does not establish that repository context was inspected.

Catalogue policy target: `policy:development.documentation.api-reference:mid:api-reference-source-code-boundary+api-reference-documentation-context`. Its current policy check proves only that error_responses is nonempty.
