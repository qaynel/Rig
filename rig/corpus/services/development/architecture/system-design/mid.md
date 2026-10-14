# development.architecture.system-design — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for system design; it does not widen ownership beyond architecture.system-design. The context signals are trust_boundaries. Binding checks: system-design-architecture-context.

Start from the existing repository's system design convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in architecture under their own verdicts.

Acceptance target: fixture:development.architecture.system-design:repository-context. Given architecture.system-design has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent architecture concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Owned scope: `architecture.system-design`.

Offer: Name the system components and the trust boundaries between them. Evaluate failure modes before adopting the diagram as a design; arrows alone do not explain resilience.

Input: `rig-services/development.architecture.system-design.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: system design configuration validation only; declared policy does not prove running system design behavior. Select an approved repository-owned command to verify that behavior.

minimal: components — ["api","database"].

mid: trust boundaries — ["external input enters api"].

maximal: failure modes — ["database unavailable"].
