# development.documentation.api-reference — behavior-oracle slice

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Policy grade. The `api-reference-slice-behavior-oracle` rule checks `documented_endpoints` nonempty. Despite the slice name, this check does not establish content correctness or behavior; Native checks require nonempty endpoint and error-response lists and authentication_documented=true in the JSON policy. They do not compare an API reference with the implemented public contract.

To verify the reference, compare each documented endpoint, response shape, error, and authentication requirement with the public API contract. This native policy check makes no such comparison.
