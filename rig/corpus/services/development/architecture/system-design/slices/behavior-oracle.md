# development.architecture.system-design — behavior-oracle slice

Policy grade slice. This slice bounds system design to architecture.system-design. It uses `system-design-slice-behavior-oracle` and checks components (nonempty): components must name the concrete repository contract..

For system design, choose a repository example that satisfies components at the behavior-oracle floor, plus a failure where components must name the concrete repository contract. is false. For system design, wire `behavior-oracle` to `rig-services/development.architecture.system-design.json` and keep its verdict on components; missing evidence is a named gap, with ceiling system design configuration validation only; declared policy does not prove running system design behavior. Choose a repository-owned check that observes system design from rig-services/development.architecture.system-design.json..

Service-specific evidence cues:
Offer: Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.
minimal: components — ["api","database"].
mid: trust boundaries — ["external input enters api"].
maximal: failure modes — ["database unavailable"].
