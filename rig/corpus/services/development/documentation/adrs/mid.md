# development.documentation.adrs — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for adrs; it does not widen ownership beyond documentation.adrs. The context signals are alternatives. Binding checks: adrs-documentation-context.

Read the existing repository's adrs convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in documentation under their own verdicts.

Acceptance target: fixture:development.documentation.adrs:repository-context. Given documentation.adrs has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent documentation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Owned scope: `documentation.adrs`.

Offer: Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Input: `rig-services/development.documentation.adrs.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior.

minimal: decision — "Use the existing journal for recovery".

mid: alternatives — ["overwrite files directly"].

maximal: consequences — ["recoverable preimages"].
