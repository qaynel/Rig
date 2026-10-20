# testing.test-data.fixtures-factories — mid

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: fixtures-factories-source-code-boundary, fixtures-factories-test-data-context.

Trace the verdict to the existing repository's fixtures factories convention, then name the source path or command that establishes it. For fixtures factories, inspect the repository's actual spec, source, test, or configuration for explicit_variants; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring test-data services outside the fixtures factories decision for test-data.fixtures-factories.

Acceptance target: policy:testing.test-data.fixtures-factories:mid:fixtures-factories-source-code-boundary+fixtures-factories-test-data-context.

Declared predicates: fixtures-factories-source-code-boundary: `fixture_defaults` is nonempty (a string or array); fixtures-factories-test-data-context: `explicit_variants` is nonempty (a string or array).
