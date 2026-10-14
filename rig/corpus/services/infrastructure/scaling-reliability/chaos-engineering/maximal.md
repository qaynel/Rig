# infrastructure.scaling-reliability.chaos-engineering — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for chaos engineering. The evidence must preserve the fault_scenarios, stop_conditions, production_experiment_without_approval inputs that determined the result. Binding checks: chaos-engineering-evidence-receipt.

Tie acceptance to a second run against unchanged chaos engineering inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:evidence-replay. Given the scaling-reliability.chaos-engineering binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Owned scope: `scaling-reliability.chaos-engineering`.

Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Input: `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.

minimal: fault scenarios — ["worker unavailable"].

mid: stop conditions — ["error budget exhausted"].

maximal: production experiment without approval — false.
