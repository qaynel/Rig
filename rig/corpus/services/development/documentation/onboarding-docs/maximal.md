# development.documentation.onboarding-docs — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for onboarding docs. The evidence must preserve the , ,  inputs that determined the result. Binding checks: onboarding-docs-evidence-receipt.

Inspect a second run against unchanged onboarding docs inputs. Record the , ,  inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this onboarding docs result is stale. The ceiling remains: Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.

Acceptance target: fixture:development.documentation.onboarding-docs:evidence-replay. Given the documentation.onboarding-docs binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Offer when a new contributor cannot locate installation and execution instructions.
minimal: setup command — ["npm","install"].
mid: run command — ["npm","start"].
maximal: check command — ["npm","test"].
