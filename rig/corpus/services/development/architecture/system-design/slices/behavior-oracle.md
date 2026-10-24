# development.architecture.system-design — behavior-oracle slice

Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Policy grade slice `system-design-slice-behavior-oracle`: Name every component of the system. An empty list leaves nothing to draw boundaries around, so enumerate the real services, stores and external callers. Despite its name this slice is not a behavior oracle: it confirms components, trust boundaries and failure modes are listed; it does not show that the design survives those failures.
