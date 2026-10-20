# system design

Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Owned scope: `architecture.system-design`.

Offer: Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Input: `rig-services/development.architecture.system-design.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: system design configuration validation only; declared policy does not prove running system design behavior. Select an approved repository-owned command to verify that behavior.

minimal: components — ["api","database"].

mid: trust boundaries — ["external input enters api"].

maximal: failure modes — ["database unavailable"].
