# API reference

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Describe endpoints and response shapes from the public contract, including errors and authentication requirements so callers can distinguish protected operations.

Owned scope: `documentation.api-reference`. Input: `rig-services/development.documentation.api-reference.json`.

Policy fields: minimal: `documented_endpoints` = ["/items"]; mid: `error_responses` = ["400 invalid input"]; maximal: `authentication_documented` = true. Native checks require nonempty endpoint and error-response lists and authentication_documented=true in the JSON policy. They do not compare an API reference with the implemented public contract.

Compare endpoints, response errors, and authentication requirements with the repository’s routes or OpenAPI contract. The example values are illustrative and are not evidence of the actual API. To verify the reference, compare each documented endpoint, response shape, error, and authentication requirement with the public API contract. This native policy check makes no such comparison.

Do not infer that an endpoint exists or is correctly documented from a nonempty list.
