# testing.test-data.fixtures-factories — maximal

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: fixtures-factories-source-code-boundary, fixtures-factories-test-data-context, fixtures-factories-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.test-data.fixtures-factories:maximal:fixtures-factories-source-code-boundary+fixtures-factories-test-data-context+fixtures-factories-evidence-receipt.

Declared predicates: fixtures-factories-source-code-boundary: `fixture_defaults` is nonempty (a string or array); fixtures-factories-test-data-context: `explicit_variants` is nonempty (a string or array); fixtures-factories-evidence-receipt: `shared_mutable_state` equals false.
