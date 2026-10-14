# development.documentation.docstrings — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for docstrings; it does not widen ownership beyond documentation.docstrings. For docstrings, inspect these context signals: parameters. Binding checks: docstrings-documentation-context.

Tie acceptance to the existing repository's docstrings convention, then name the source path or command that establishes it. For docstrings, inspect the repository's actual spec, source, test, or configuration for parameters; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring documentation services outside the docstrings decision for documentation.docstrings.

Acceptance target: fixture:development.documentation.docstrings:repository-context. Given documentation.docstrings has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent documentation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.
minimal: documented symbols — ["parseRecord"].
mid: parameters — ["raw: serialized record"].
maximal: failure contract — "throws on malformed records".
