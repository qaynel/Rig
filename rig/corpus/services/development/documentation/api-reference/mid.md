# development.documentation.api-reference — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for api reference; it does not widen ownership beyond documentation.api-reference. The context signals are error_responses. Binding checks: api-reference-documentation-context.

Read the existing repository's api reference convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in documentation under their own verdicts.

Acceptance target: fixture:development.documentation.api-reference:repository-context. Given documentation.api-reference has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent documentation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Owned scope: `documentation.api-reference`.

Offer: Describe actual endpoints, response shapes and error cases from the public contract. Authentication requirements belong beside the endpoint so a caller cannot mistake protected operations for public ones.

Input: `rig-services/development.documentation.api-reference.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: api reference configuration validation only; declared policy does not prove running api reference behavior. Select an approved repository-owned command to verify that behavior.

minimal: documented endpoints — ["/items"].

mid: error responses — ["400 invalid input"].

maximal: authentication documented — true.
