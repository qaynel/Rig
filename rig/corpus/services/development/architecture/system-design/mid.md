# development.architecture.system-design — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for system design; it does not widen ownership beyond architecture.system-design. For system design, inspect these context signals: trust_boundaries. Binding checks: system-design-architecture-context.

Start from the existing repository's system design convention, then name the source path or command that establishes it. For system design, inspect the repository's actual spec, source, test, or configuration for trust_boundaries; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring architecture services outside the system design decision for architecture.system-design.

Acceptance target: fixture:development.architecture.system-design:repository-context. Given architecture.system-design has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent architecture concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.
minimal: components — ["api","database"].
mid: trust boundaries — ["external input enters api"].
maximal: failure modes — ["database unavailable"].
