# testing.unit.edge-boundary - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

edge boundary is the sole catalogue owner of `unit.edge-boundary`. It must not absorb other unit concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `unit.edge-boundary`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.unit.edge-boundary:policy-boundary. Given source-code is present and unit.edge-boundary is selected, pass only when the repository binding evaluates unit.edge-boundary and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern.
