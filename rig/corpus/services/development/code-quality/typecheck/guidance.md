# typecheck

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Owned scope: `code-quality.typecheck`.

Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Input: `rig-services/development.code-quality.typecheck.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Select an approved repository-owned command to verify that behavior.

minimal: typecheck command — ["npm","run","typecheck"].

mid: checked components — ["src"].

maximal: ignore type errors — false.
