# development.code-quality.correctness-static — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for correctness static. The evidence must preserve the analyzer_command, enabled_rules, ignore_analyzer_failure inputs that determined the result. Binding checks: correctness-static-evidence-receipt.

Inspect a second run against unchanged correctness static inputs. Record the analyzer_command, enabled_rules, ignore_analyzer_failure inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this correctness static result is stale. The ceiling remains: correctness static configuration validation only; declared policy does not prove running correctness static behavior. Choose a repository-owned check that observes correctness static from rig-services/development.code-quality.correctness-static.json.

Acceptance target: fixture:development.code-quality.correctness-static:evidence-replay. Given the correctness-static-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.
minimal: analyzer command — ["npm","run","analyze"].
mid: enabled rules — ["null-dereference"].
maximal: ignore analyzer failure — false.
