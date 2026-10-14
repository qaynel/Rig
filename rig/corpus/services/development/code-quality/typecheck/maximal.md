# development.code-quality.typecheck — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for typecheck. The evidence must preserve the typecheck_command, checked_components, ignore_type_errors inputs that determined the result. Binding checks: typecheck-evidence-receipt.

Trace the verdict to a second run against unchanged typecheck inputs. Record the typecheck_command, checked_components, ignore_type_errors inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this typecheck result is stale. The ceiling remains: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Choose a repository-owned check that observes typecheck from rig-services/development.code-quality.typecheck.json.

Acceptance target: fixture:development.code-quality.typecheck:evidence-replay. Given the code-quality.typecheck binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.
minimal: typecheck command — ["npm","run","typecheck"].
mid: checked components — ["src"].
maximal: ignore type errors — false.
