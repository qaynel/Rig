# development.documentation.api-reference — property-floor slice

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Policy grade. The `api-reference-slice-property-floor` rule checks `documented_endpoints` nonempty. Despite the slice name, this check does not establish content correctness or behavior; Native checks require nonempty endpoint and error-response lists and authentication_documented=true in the JSON policy. They do not compare an API reference with the implemented public contract.

The policy check does not exercise a property of the documentation itself. Compare endpoints, response errors, and authentication requirements with the repository’s routes or OpenAPI contract. The example values are illustrative and are not evidence of the actual API.
