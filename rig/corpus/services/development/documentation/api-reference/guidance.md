# api reference

Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Owned scope: `documentation.api-reference`.

Offer: Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Input: `rig-services/development.documentation.api-reference.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: api reference configuration validation only; declared policy does not prove running api reference behavior. Select an approved repository-owned command to verify that behavior.

minimal: documented endpoints — ["/items"].

mid: error responses — ["400 invalid input"].

maximal: authentication documented — true.

