# testing.test-data.fixtures-factories — minimal

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Policy grade, minimal: Keep fixture defaults valid and list them. Invalid defaults hide the scenario, so declare the baseline record. Binding checks: fixtures-factories-source-code-boundary.

Acceptance target: policy:testing.test-data.fixtures-factories:minimal:fixtures-factories-source-code-boundary.
Declared predicates: fixtures-factories-source-code-boundary: `fixture_defaults` is nonempty (a string or array).
