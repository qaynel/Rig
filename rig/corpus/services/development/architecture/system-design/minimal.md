# development.architecture.system-design — minimal

Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for system design. The minimal boundary for system design checks components (nonempty): components must name the concrete repository contract. Binding checks: system-design-source-code-boundary.

Use a repository-owned command or existing native check that can observe architecture.system-design; bind it to the input named in `rig-services/development.architecture.system-design.json` and preserve the check's failure status. When adopting this in an existing repository, connect system design to the command that inspects components and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside architecture.system-design as a failure.

Acceptance target: policy:development.architecture.system-design:minimal:system-design-source-code-boundary.

Declared predicates: system-design-source-code-boundary: `components` is nonempty (a string or array).
