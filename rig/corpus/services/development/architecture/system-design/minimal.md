# development.architecture.system-design — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for system design. It checks components (nonempty): components must name the concrete repository contract.. Binding checks: system-design-source-code-boundary.

Use a repository-owned command or existing native check that can observe architecture.system-design; bind it to the input named in `rig-services/development.architecture.system-design.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside architecture.system-design is a failure.

Acceptance target: fixture:development.architecture.system-design:policy-boundary. Given source-code is present and architecture.system-design is selected, pass only when the repository binding evaluates architecture.system-design and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Owned scope: `architecture.system-design`.

Offer: Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Input: `rig-services/development.architecture.system-design.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: system design configuration validation only; declared policy does not prove running system design behavior. Select an approved repository-owned command to verify that behavior.

minimal: components — ["api","database"].

mid: trust boundaries — ["external input enters api"].

maximal: failure modes — ["database unavailable"].
