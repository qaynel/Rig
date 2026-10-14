# development.code-quality.typecheck — identity

Policy grade: typecheck owns code-quality.typecheck. Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Keep sibling services in code-quality under their own verdicts. Read the configured input at `rig-services/development.code-quality.typecheck.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-quality.typecheck:policy-boundary. Given source-code is present and code-quality.typecheck is selected, pass only when the repository binding evaluates code-quality.typecheck and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern.

Service-specific evidence cues:
Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Owned scope: `code-quality.typecheck`.

Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Input: `rig-services/development.code-quality.typecheck.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Select an approved repository-owned command to verify that behavior.

minimal: typecheck command — ["npm","run","typecheck"].

mid: checked components — ["src"].

maximal: ignore type errors — false.
