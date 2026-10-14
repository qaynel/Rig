# development.code-quality.typecheck — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for typecheck; it does not widen ownership beyond code-quality.typecheck. For typecheck, inspect these context signals: checked_components. Binding checks: typecheck-code-quality-context.

Start from the existing repository's typecheck convention, then name the source path or command that establishes it. For typecheck, inspect the repository's actual spec, source, test, or configuration for checked_components; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-quality services outside the typecheck decision for code-quality.typecheck.

Acceptance target: fixture:development.code-quality.typecheck:repository-context. Given code-quality.typecheck has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code quality concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.
minimal: typecheck command — ["npm","run","typecheck"].
mid: checked components — ["src"].
maximal: ignore type errors — false.
