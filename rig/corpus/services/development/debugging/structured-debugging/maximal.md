# development.debugging.structured-debugging — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for structured debugging. The evidence must preserve the reproduction_steps, ranked_hypotheses, change_before_reproduction inputs that determined the result. Binding checks: structured-debugging-evidence-receipt.

Tie acceptance to a second run against unchanged structured debugging inputs. Record the reproduction_steps, ranked_hypotheses, change_before_reproduction inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this structured debugging result is stale. The ceiling remains: structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Choose a repository-owned check that observes structured debugging from rig-services/development.debugging.structured-debugging.json.

Acceptance target: fixture:development.debugging.structured-debugging:evidence-replay. Given the debugging.structured-debugging binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.
minimal: reproduction steps — ["run failing case"].
mid: ranked hypotheses — ["invalid input reaches parser"].
maximal: change before reproduction — false.
