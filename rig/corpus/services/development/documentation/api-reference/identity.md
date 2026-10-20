# development.documentation.api-reference — identity

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Policy grade. Describe endpoints and response shapes from the public contract, including errors and authentication requirements so callers can distinguish protected operations.

Applicable surface: source-code. Owned scope: `documentation.api-reference`.

Disposition: executable. Native checks validate only declared policy fields.

Native checks require nonempty endpoint and error-response lists and authentication_documented=true in the JSON policy. They do not compare an API reference with the implemented public contract.

Configured examples (minimal: `documented_endpoints` = ["/items"]; mid: `error_responses` = ["400 invalid input"]; maximal: `authentication_documented` = true) describe expected policy only. They are not repository-derived fixtures.
