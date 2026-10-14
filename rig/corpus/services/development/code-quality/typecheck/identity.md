# development.code-quality.typecheck — identity

Policy grade: typecheck owns code-quality.typecheck. Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Keep neighboring code-quality services outside the typecheck decision for code-quality.typecheck. Read the configured input at `rig-services/development.code-quality.typecheck.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Choose a repository-owned check that observes typecheck from rig-services/development.code-quality.typecheck.json.

Acceptance target: fixture:development.code-quality.typecheck:policy-boundary. Given source-code is present and code-quality.typecheck is selected, pass only when the repository binding evaluates code-quality.typecheck and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern.

Service-specific evidence cues:
Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.
minimal: typecheck command — ["npm","run","typecheck"].
mid: checked components — ["src"].
maximal: ignore type errors — false.
