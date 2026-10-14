# development.architecture.system-design — identity

Policy grade: system design owns architecture.system-design. Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Keep neighboring architecture services outside the system design decision for architecture.system-design. Read the configured input at `rig-services/development.architecture.system-design.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: system design configuration validation only; declared policy does not prove running system design behavior. Choose a repository-owned check that observes system design from rig-services/development.architecture.system-design.json.

Acceptance target: fixture:development.architecture.system-design:policy-boundary. Given source-code is present and architecture.system-design is selected, pass only when the repository binding evaluates architecture.system-design and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern.

Service-specific evidence cues:
Offer: Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.
minimal: components — ["api","database"].
mid: trust boundaries — ["external input enters api"].
maximal: failure modes — ["database unavailable"].
