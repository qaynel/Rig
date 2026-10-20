# development.architecture.system-design — minimal

Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Policy grade, minimal: Name every component of the system. An empty list leaves nothing to draw boundaries around, so enumerate the real services, stores and external callers. Binding checks: system-design-source-code-boundary.

Acceptance target: policy:development.architecture.system-design:minimal:system-design-source-code-boundary.
Declared predicates: system-design-source-code-boundary: `components` is nonempty (a string or array).
