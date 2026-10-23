# testing.test-data.fixtures-factories — mid

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Policy grade, mid: List the explicit variants for each behavior. Implicit variants obscure what is tested, so name them. Cumulative with minimal. Binding checks: fixtures-factories-source-code-boundary, fixtures-factories-test-data-context.

Acceptance target: policy:testing.test-data.fixtures-factories:mid:fixtures-factories-source-code-boundary+fixtures-factories-test-data-context.
Declared predicates: fixtures-factories-source-code-boundary: `fixture_defaults` is nonempty (a string or array); fixtures-factories-test-data-context: `explicit_variants` is nonempty (a string or array).
