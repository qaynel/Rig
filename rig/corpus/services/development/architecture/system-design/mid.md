# development.architecture.system-design — mid

Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Policy grade, mid: Name each trust boundary between components. Without them an arrow could cross a privilege change unnoticed, so list where authority or data sensitivity changes. Cumulative with minimal. Binding checks: system-design-source-code-boundary, system-design-architecture-context.

Acceptance target: policy:development.architecture.system-design:mid:system-design-source-code-boundary+system-design-architecture-context.
Declared predicates: system-design-source-code-boundary: `components` is nonempty (a string or array); system-design-architecture-context: `trust_boundaries` is nonempty (a string or array).
