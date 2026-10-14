# development.documentation.api-reference — identity

Policy grade: api reference owns documentation.api-reference. Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Keep neighboring documentation services outside the api reference decision for documentation.api-reference. Anchor the review on the configured input at `rig-services/development.documentation.api-reference.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: api reference configuration validation only; declared policy does not prove running api reference behavior. Choose a repository-owned check that observes api reference from rig-services/development.documentation.api-reference.json.

Acceptance target: fixture:development.documentation.api-reference:policy-boundary. Given source-code is present and documentation.api-reference is selected, pass only when the repository binding evaluates documentation.api-reference and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern.

Service-specific evidence cues:
Offer: Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.
minimal: documented endpoints — ["/items"].
mid: error responses — ["400 invalid input"].
maximal: authentication documented — true.
