# development.documentation.api-reference — maximal

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: api-reference-source-code-boundary, api-reference-documentation-context, api-reference-evidence-receipt.

To verify the reference, compare each documented endpoint, response shape, error, and authentication requirement with the public API contract. This native policy check makes no such comparison. The native rule does not verify this runtime evidence or perform a replay.

Catalogue policy target: `policy:development.documentation.api-reference:maximal:api-reference-source-code-boundary+api-reference-documentation-context+api-reference-evidence-receipt`. Its current policy check proves only that authentication_documented equals true.
