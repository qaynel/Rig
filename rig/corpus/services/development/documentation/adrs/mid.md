# development.documentation.adrs — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for adrs; it does not widen ownership beyond documentation.adrs. For adrs, inspect these context signals: alternatives. Binding checks: adrs-documentation-context.

Read the existing repository's adrs convention, then name the source path or command that establishes it. For adrs, inspect the repository's actual spec, source, test, or configuration for alternatives; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring documentation services outside the adrs decision for documentation.adrs.

Acceptance target: fixture:development.documentation.adrs:repository-context. Given documentation.adrs has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent documentation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.
minimal: decision — "Use the existing journal for recovery".
mid: alternatives — ["overwrite files directly"].
maximal: consequences — ["recoverable preimages"].
