# development.code-quality.typecheck — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for typecheck; it does not widen ownership beyond code-quality.typecheck. The context signals are checked_components. Binding checks: typecheck-code-quality-context.

Start from the existing repository's typecheck convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in code-quality under their own verdicts.

Acceptance target: fixture:development.code-quality.typecheck:repository-context. Given code-quality.typecheck has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code quality concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Owned scope: `code-quality.typecheck`.

Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Input: `rig-services/development.code-quality.typecheck.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Select an approved repository-owned command to verify that behavior.

minimal: typecheck command — ["npm","run","typecheck"].

mid: checked components — ["src"].

maximal: ignore type errors — false.
