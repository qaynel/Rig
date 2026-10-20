# system-design

Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Owned scope: `architecture.system-design`. Input: `rig-services/development.architecture.system-design.json`.

Coverage ceiling: Configuration validation only, so it confirms components, trust boundaries and failure modes are listed; it does not show that the design survives those failures.

minimal: components — ["api","database"]. Name every component of the system. An empty list leaves nothing to draw boundaries around, so enumerate the real services, stores and external callers.

mid: trust boundaries — ["external input enters api"]. Name each trust boundary between components. Without them an arrow could cross a privilege change unnoticed, so list where authority or data sensitivity changes.

maximal: failure modes — ["database unavailable"]. List the failure modes evaluated, such as dependency loss or partial writes. An empty list means resilience was assumed from the diagram, so add the failures you examined.
