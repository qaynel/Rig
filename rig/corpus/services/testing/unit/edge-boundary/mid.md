# testing.unit.edge-boundary — mid

Mid adds repository context for edge boundary; it does not widen ownership beyond unit.edge-boundary. The context signals are invalid_cases.

Ground the decision in the existing repository's edge boundary convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in unit under their own verdicts.

Acceptance target: fixture:testing.unit.edge-boundary:repository-context. Given unit.edge-boundary has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent unit concern; fail when the result infers local convention without an inspectable source.
