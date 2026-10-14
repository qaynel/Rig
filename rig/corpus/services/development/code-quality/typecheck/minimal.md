# development.code-quality.typecheck — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for typecheck. It checks typecheck_command (nonempty): typecheck command must name the concrete repository contract.. Binding checks: typecheck-source-code-boundary.

Use a repository-owned command or existing native check that can observe code-quality.typecheck; bind it to the input named in `rig-services/development.code-quality.typecheck.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside code-quality.typecheck is a failure.

Acceptance target: fixture:development.code-quality.typecheck:policy-boundary. Given source-code is present and code-quality.typecheck is selected, pass only when the repository binding evaluates code-quality.typecheck and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Owned scope: `code-quality.typecheck`.

Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Input: `rig-services/development.code-quality.typecheck.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Select an approved repository-owned command to verify that behavior.

minimal: typecheck command — ["npm","run","typecheck"].

mid: checked components — ["src"].

maximal: ignore type errors — false.
