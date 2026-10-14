# development.code-creation.refactoring — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for refactoring; it does not widen ownership beyond code-creation.refactoring. For refactoring, inspect these context signals: public_api_changes. Binding checks: refactoring-code-creation-context.

Use the existing repository's refactoring convention, then name the source path or command that establishes it. For refactoring, inspect the repository's actual spec, source, test, or configuration for public_api_changes; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-creation services outside the refactoring decision for code-creation.refactoring.

Acceptance target: fixture:development.code-creation.refactoring:repository-context. Given code-creation.refactoring has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.
minimal: preserved behaviors — ["public API returns unchanged values"].
mid: public api changes — 0.
maximal: rollback strategy — "revert-commit".
