# development.documentation.onboarding-docs — maximal

Maximal adds a replayable evidence receipt for onboarding docs. The evidence must preserve the , ,  inputs that determined the result.

Inspect a second run against unchanged onboarding docs inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.

Acceptance target: fixture:development.documentation.onboarding-docs:evidence-replay. Given the documentation.onboarding-docs binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
