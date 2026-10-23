# development.documentation.api-reference — behavior-oracle slice

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Policy grade. `api-reference-slice-behavior-oracle` checks only for a nonempty endpoint list. It does not compare the reference against the implemented API and cannot detect a stale path or incorrect response shape.

Runtime contract review must compare the reference with route definitions or the authoritative API schema; this native rule is not that review.
