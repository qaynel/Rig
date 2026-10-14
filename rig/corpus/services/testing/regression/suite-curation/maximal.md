# testing.regression.suite-curation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for suite curation. The evidence must preserve the retained_suites, retirement_reasons, remove_without_behavior_owner inputs that determined the result. Binding checks: suite-curation-evidence-receipt.

Trace the verdict to a second run against unchanged suite curation inputs. Record the retained_suites, retirement_reasons, remove_without_behavior_owner inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this suite curation result is stale. The ceiling remains: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Choose a repository-owned check that observes suite curation from rig-services/testing.regression.suite-curation.json.

Acceptance target: fixture:testing.regression.suite-curation:evidence-replay. Given the regression.suite-curation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.
minimal: retained suites — ["critical regression"].
mid: retirement reasons — ["obsolete API removed"].
maximal: remove without behavior owner — false.
