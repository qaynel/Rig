# development.documentation.docstrings — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for docstrings; it does not widen ownership beyond documentation.docstrings. The context signals are parameters. Binding checks: docstrings-documentation-context.

Tie acceptance to the existing repository's docstrings convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in documentation under their own verdicts.

Acceptance target: fixture:development.documentation.docstrings:repository-context. Given documentation.docstrings has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent documentation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Owned scope: `documentation.docstrings`.

Offer: Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Input: `rig-services/development.documentation.docstrings.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: docstrings configuration validation only; declared policy does not prove running docstrings behavior. Select an approved repository-owned command to verify that behavior.

minimal: documented symbols — ["parseRecord"].

mid: parameters — ["raw: serialized record"].

maximal: failure contract — "throws on malformed records".
