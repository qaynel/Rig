# development.code-creation.feature-implementation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for feature implementation; it does not widen ownership beyond code-creation.feature-implementation. For feature implementation, inspect these context signals: change_scope. Binding checks: feature-implementation-code-creation-context.

Trace the verdict to the existing repository's feature implementation convention, then name the source path or command that establishes it. For feature implementation, inspect the repository's actual spec, source, test, or configuration for change_scope; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-creation services outside the feature implementation decision for code-creation.feature-implementation.

Acceptance target: fixture:development.code-creation.feature-implementation:repository-context. Given code-creation.feature-implementation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.
minimal: acceptance cases — ["creates an item","rejects invalid input"].
mid: change scope — ["src/items.js"].
maximal: compatibility — "preserve-existing-behavior".
