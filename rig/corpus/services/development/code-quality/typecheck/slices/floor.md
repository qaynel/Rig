# development.code-quality.typecheck — floor and mutation-floor slice

Policy grade slice. This slice bounds typecheck to code-quality.typecheck. It uses `typecheck-slice-floor` and checks typecheck_command (nonempty): typecheck command must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-quality.typecheck.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than typecheck configuration validation only; declared policy does not prove running typecheck behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Owned scope: `code-quality.typecheck`.

Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Input: `rig-services/development.code-quality.typecheck.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Select an approved repository-owned command to verify that behavior.

minimal: typecheck command — ["npm","run","typecheck"].

mid: checked components — ["src"].

maximal: ignore type errors — false.
