# development.documentation.docstrings — identity

Policy grade: docstrings owns documentation.docstrings. Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Keep sibling services in documentation under their own verdicts. Trace the verdict to the configured input at `rig-services/development.documentation.docstrings.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: docstrings configuration validation only; declared policy does not prove running docstrings behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.documentation.docstrings:policy-boundary. Given source-code is present and documentation.docstrings is selected, pass only when the repository binding evaluates documentation.docstrings and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern.

Service-specific evidence cues:
Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Owned scope: `documentation.docstrings`.

Offer: Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Input: `rig-services/development.documentation.docstrings.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: docstrings configuration validation only; declared policy does not prove running docstrings behavior. Select an approved repository-owned command to verify that behavior.

minimal: documented symbols — ["parseRecord"].

mid: parameters — ["raw: serialized record"].

maximal: failure contract — "throws on malformed records".
