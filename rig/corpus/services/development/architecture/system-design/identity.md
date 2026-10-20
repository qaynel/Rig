# development.architecture.system-design — identity

Policy grade: system-design owns architecture.system-design. Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Input: `rig-services/development.architecture.system-design.json`. Configuration validation only, so it confirms components, trust boundaries and failure modes are listed; it does not show that the design survives those failures.

Disposition: executable.
Acceptance target: policy:development.architecture.system-design:minimal:system-design-source-code-boundary.
Declared predicates: system-design-source-code-boundary: `components` is nonempty (a string or array).
