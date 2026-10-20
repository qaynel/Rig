# development.code-quality.typecheck — behavior-oracle slice

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Policy grade slice `typecheck-slice-behavior-oracle`: Bind the type checker to the repository's typecheck command. A missing command means types are unchecked, so name the real task. Despite its name this slice is not a behavior oracle: it confirms the type-check command, covered components and suppression setting are declared; it does not show the code type-checks.
