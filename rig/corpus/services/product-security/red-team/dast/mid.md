# product-security.red-team.dast — mid

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: dast-source-code-boundary, dast-red-team-context.

Replace the example origin and paths with a target explicitly approved for testing. A nonempty string does not prove the target is controlled by the repository owner. No repository-specific evidence source is supplied by this policy definition, and a nonempty value does not prove that the local boundary has been inspected.

Catalogue policy target: `policy:product-security.red-team.dast:mid:dast-source-code-boundary+dast-red-team-context`. The native rule establishes only that authorized_scope is nonempty.
