# development.documentation.api-reference — floor and mutation-floor slice

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Policy grade. The `api-reference-slice-floor` and `api-reference-slice-mutation-floor` checks require at least one configured `documented_endpoints` value. The slice does not query routes or modify API documentation.

Example policy value: `documented_endpoints` = ["/items"]. A value here is not proof that this endpoint exists, has that response shape, or is publicly accessible.
