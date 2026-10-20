# development.code-quality.typecheck — floor and mutation-floor slice

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Policy grade slice. This slice bounds typecheck to code-quality.typecheck. It uses `typecheck-slice-floor` and checks typecheck_command (nonempty): typecheck command must name the concrete repository contract.