# testing.test-data.fixtures-factories — maximal

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Policy grade, maximal: Set shared mutable state to false. Tests changing shared fixtures affect each other, so build fresh data per test. Cumulative with minimal and mid. Binding checks: fixtures-factories-source-code-boundary, fixtures-factories-test-data-context, fixtures-factories-evidence-receipt.

Acceptance target: policy:testing.test-data.fixtures-factories:maximal:fixtures-factories-source-code-boundary+fixtures-factories-test-data-context+fixtures-factories-evidence-receipt.
Declared predicates: fixtures-factories-source-code-boundary: `fixture_defaults` is nonempty (a string or array); fixtures-factories-test-data-context: `explicit_variants` is nonempty (a string or array); fixtures-factories-evidence-receipt: `shared_mutable_state` equals false.
