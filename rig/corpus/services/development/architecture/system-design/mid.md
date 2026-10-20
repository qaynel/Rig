# development.architecture.system-design — mid

Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: system-design-source-code-boundary, system-design-architecture-context.

Start from the existing repository's system design convention, then name the source path or command that establishes it. For system design, inspect the repository's actual spec, source, test, or configuration for trust_boundaries; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring architecture services outside the system design decision for architecture.system-design.

Acceptance target: policy:development.architecture.system-design:mid:system-design-source-code-boundary+system-design-architecture-context.

Declared predicates: system-design-source-code-boundary: `components` is nonempty (a string or array); system-design-architecture-context: `trust_boundaries` is nonempty (a string or array).
