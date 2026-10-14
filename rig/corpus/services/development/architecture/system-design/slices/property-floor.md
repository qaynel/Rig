# development.architecture.system-design — property-floor slice

Policy grade slice. This slice bounds system design to architecture.system-design. It uses `system-design-slice-property-floor` and checks components (nonempty): components must name the concrete repository contract..

Inspect a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.architecture.system-design.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than system design configuration validation only; declared policy does not prove running system design behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Owned scope: `architecture.system-design`.

Offer: Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Input: `rig-services/development.architecture.system-design.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: system design configuration validation only; declared policy does not prove running system design behavior. Select an approved repository-owned command to verify that behavior.

minimal: components — ["api","database"].

mid: trust boundaries — ["external input enters api"].

maximal: failure modes — ["database unavailable"].
