# typecheck

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Owned scope: `code-quality.typecheck`. Input: `rig-services/development.code-quality.typecheck.json`.

Coverage ceiling: Configuration validation only, so it confirms the type-check command, covered components and suppression setting are declared; it does not show the code type-checks.

minimal: typecheck command — ["npm","run","typecheck"]. Bind the type checker to the repository's typecheck command. A missing command means types are unchecked, so name the real task.

mid: checked components — ["src"]. List the components the type checker covers. A silently excluded package hides type errors, so enumerate every covered component.

maximal: ignore type errors — false. Set ignoring type errors to false. Suppressing errors manufactures a clean result, so fix the errors or record them as findings.
