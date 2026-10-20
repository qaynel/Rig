# development.code-quality.typecheck — identity

Policy grade: typecheck owns code-quality.typecheck. Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Input: `rig-services/development.code-quality.typecheck.json`. Configuration validation only, so it confirms the type-check command, covered components and suppression setting are declared; it does not show the code type-checks.

Disposition: executable.
Acceptance target: policy:development.code-quality.typecheck:minimal:typecheck-source-code-boundary.
Declared predicates: typecheck-source-code-boundary: `typecheck_command` is nonempty (a string or array).
