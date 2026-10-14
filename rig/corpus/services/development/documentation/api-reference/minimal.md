# development.documentation.api-reference — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for api reference. The minimal boundary for api reference checks documented_endpoints (nonempty): documented endpoints must name the concrete repository contract.. Binding checks: api-reference-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe documentation.api-reference; bind it to the input named in `rig-services/development.documentation.api-reference.json` and preserve the check's failure status. When adopting this in an existing repository, connect api reference to the command that inspects documented_endpoints and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside documentation.api-reference as a failure.

Acceptance target: fixture:development.documentation.api-reference:policy-boundary. Given source-code is present and documentation.api-reference is selected, pass only when the repository binding evaluates documentation.api-reference and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. The ceiling is api reference configuration validation only; declared policy does not prove running api reference behavior. Choose a repository-owned check that observes api reference from rig-services/development.documentation.api-reference.json..

Service-specific evidence cues:
Offer: Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.
minimal: documented endpoints — ["/items"].
mid: error responses — ["400 invalid input"].
maximal: authentication documented — true.
