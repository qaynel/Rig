# development.code-quality.typecheck — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for typecheck. The minimal boundary for typecheck checks typecheck_command (nonempty): typecheck command must name the concrete repository contract.. Binding checks: typecheck-source-code-boundary.

Use a repository-owned command or existing native check that can observe code-quality.typecheck; bind it to the input named in `rig-services/development.code-quality.typecheck.json` and preserve the check's failure status. When adopting this in an existing repository, connect typecheck to the command that inspects typecheck_command and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-quality.typecheck as a failure.

Acceptance target: fixture:development.code-quality.typecheck:policy-boundary. Given source-code is present and code-quality.typecheck is selected, pass only when the repository binding evaluates code-quality.typecheck and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern. The ceiling is typecheck configuration validation only; declared policy does not prove running typecheck behavior. Choose a repository-owned check that observes typecheck from rig-services/development.code-quality.typecheck.json..

Service-specific evidence cues:
Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.
minimal: typecheck command — ["npm","run","typecheck"].
mid: checked components — ["src"].
maximal: ignore type errors — false.
