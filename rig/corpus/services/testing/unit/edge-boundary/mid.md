# testing.unit.edge-boundary — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for edge boundary; it does not widen ownership beyond unit.edge-boundary. For edge boundary, inspect these context signals: invalid_cases. Binding checks: edge-boundary-unit-context.

Ground the decision in the existing repository's edge boundary convention, then name the source path or command that establishes it. For edge boundary, inspect the repository's actual spec, source, test, or configuration for invalid_cases; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring unit services outside the edge boundary decision for unit.edge-boundary.

Acceptance target: fixture:testing.unit.edge-boundary:repository-context. Given unit.edge-boundary has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent unit concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.
minimal: boundary cases — ["empty input","maximum length"].
mid: invalid cases — ["negative count"].
maximal: normal only tests — false.
