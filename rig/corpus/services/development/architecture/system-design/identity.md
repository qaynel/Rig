# development.architecture.system-design — identity

Policy grade: system design owns architecture.system-design. Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Keep neighboring architecture services outside the system design decision for architecture.system-design. Read the configured input at `rig-services/development.architecture.system-design.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: system design configuration validation only; declared policy does not prove running system design behavior. Choose a repository-owned check that observes system design from rig-services/development.architecture.system-design.json.

Acceptance target: policy:development.architecture.system-design:minimal:system-design-source-code-boundary.

Declared predicates: system-design-source-code-boundary: `components` is nonempty (a string or array).
