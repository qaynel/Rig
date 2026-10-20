# development.architecture.system-design — maximal

Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: system-design-source-code-boundary, system-design-architecture-context, system-design-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.architecture.system-design:maximal:system-design-source-code-boundary+system-design-architecture-context+system-design-evidence-receipt.

Declared predicates: system-design-source-code-boundary: `components` is nonempty (a string or array); system-design-architecture-context: `trust_boundaries` is nonempty (a string or array); system-design-evidence-receipt: `failure_modes` is nonempty (a string or array).
