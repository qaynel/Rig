# development.architecture.system-design — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for system design. The evidence must preserve the components, trust_boundaries, failure_modes inputs that determined the result. Binding checks: system-design-evidence-receipt.

Trace the verdict to a second run against unchanged system design inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: system design configuration validation only; declared policy does not prove running system design behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.architecture.system-design:evidence-replay. Given the architecture.system-design binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Owned scope: `architecture.system-design`.

Offer: Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Input: `rig-services/development.architecture.system-design.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: system design configuration validation only; declared policy does not prove running system design behavior. Select an approved repository-owned command to verify that behavior.

minimal: components — ["api","database"].

mid: trust boundaries — ["external input enters api"].

maximal: failure modes — ["database unavailable"].
