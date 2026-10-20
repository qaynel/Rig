# development.architecture.system-design — maximal

Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Policy grade, maximal: List the failure modes evaluated, such as dependency loss or partial writes. An empty list means resilience was assumed from the diagram, so add the failures you examined. Cumulative with minimal and mid. Binding checks: system-design-source-code-boundary, system-design-architecture-context, system-design-evidence-receipt.

Acceptance target: policy:development.architecture.system-design:maximal:system-design-source-code-boundary+system-design-architecture-context+system-design-evidence-receipt.
Declared predicates: system-design-source-code-boundary: `components` is nonempty (a string or array); system-design-architecture-context: `trust_boundaries` is nonempty (a string or array); system-design-evidence-receipt: `failure_modes` is nonempty (a string or array).
