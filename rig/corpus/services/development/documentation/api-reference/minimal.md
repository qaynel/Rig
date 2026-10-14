# development.documentation.api-reference — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for api reference. It checks documented_endpoints (nonempty): documented endpoints must name the concrete repository contract.. Binding checks: api-reference-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe documentation.api-reference; bind it to the input named in `rig-services/development.documentation.api-reference.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside documentation.api-reference is a failure.

Acceptance target: fixture:development.documentation.api-reference:policy-boundary. Given source-code is present and documentation.api-reference is selected, pass only when the repository binding evaluates documentation.api-reference and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Owned scope: `documentation.api-reference`.

Offer: Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Input: `rig-services/development.documentation.api-reference.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: api reference configuration validation only; declared policy does not prove running api reference behavior. Select an approved repository-owned command to verify that behavior.

minimal: documented endpoints — ["/items"].

mid: error responses — ["400 invalid input"].

maximal: authentication documented — true.
