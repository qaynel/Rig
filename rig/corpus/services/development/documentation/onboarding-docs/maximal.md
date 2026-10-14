# development.documentation.onboarding-docs — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for onboarding docs. The evidence must preserve the , ,  inputs that determined the result. Binding checks: onboarding-docs-evidence-receipt.

Inspect a second run against unchanged onboarding docs inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.

Acceptance target: fixture:development.documentation.onboarding-docs:evidence-replay. Given the documentation.onboarding-docs binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Give contributors a reproducible setup, a way to run the project and a way to verify changes. Keep those commands aligned with repository-owned tasks so new teammates do not need oral setup instructions.

Owned scope: `documentation.onboarding-docs`.

Offer: Offer when a new contributor cannot locate installation and execution instructions.

Input: `README.md`. Detection records the path even when its contents are malformed.

Coverage ceiling: Checks documented setup, run and verification instructions; does not execute installation or prove that the instructions work on another machine.

minimal: setup command — ["npm","install"].

mid: run command — ["npm","start"].

maximal: check command — ["npm","test"].
