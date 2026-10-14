# development.code-quality.typecheck — property-floor slice

Policy grade slice. This slice bounds typecheck to code-quality.typecheck. It uses `typecheck-slice-property-floor` and checks typecheck_command (nonempty): typecheck command must name the concrete repository contract..

For typecheck, choose a repository example that satisfies typecheck_command at the property-floor floor, plus a failure where typecheck command must name the concrete repository contract. is false. For typecheck, wire `property-floor` to `rig-services/development.code-quality.typecheck.json` and keep its verdict on typecheck_command; missing evidence is a named gap, with ceiling typecheck configuration validation only; declared policy does not prove running typecheck behavior. Choose a repository-owned check that observes typecheck from rig-services/development.code-quality.typecheck.json..

Service-specific evidence cues:
Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.
minimal: typecheck command — ["npm","run","typecheck"].
mid: checked components — ["src"].
maximal: ignore type errors — false.
