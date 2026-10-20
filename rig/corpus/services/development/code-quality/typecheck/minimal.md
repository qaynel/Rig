# development.code-quality.typecheck — minimal

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for typecheck. The minimal boundary for typecheck checks typecheck_command (nonempty): typecheck command must name the concrete repository contract. Binding checks: typecheck-source-code-boundary.

Use a repository-owned command or existing native check that can observe code-quality.typecheck; bind it to the input named in `rig-services/development.code-quality.typecheck.json` and preserve the check's failure status. When adopting this in an existing repository, connect typecheck to the command that inspects typecheck_command and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-quality.typecheck as a failure.

Acceptance target: policy:development.code-quality.typecheck:minimal:typecheck-source-code-boundary.

Declared predicates: typecheck-source-code-boundary: `typecheck_command` is nonempty (a string or array).
