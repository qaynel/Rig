# development.code-quality.typecheck — floor and mutation-floor slice

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Policy grade slice `typecheck-slice-floor`: Bind the type checker to the repository's typecheck command. A missing command means types are unchecked, so name the real task.
