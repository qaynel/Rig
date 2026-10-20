# testing.integration.cross-module — maximal

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: cross-module-source-code-boundary, cross-module-integration-context, cross-module-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.integration.cross-module:maximal:cross-module-source-code-boundary+cross-module-integration-context+cross-module-evidence-receipt.

Declared predicates: cross-module-source-code-boundary: `participating_modules` is nonempty (a string or array); cross-module-integration-context: `interaction_cases` is nonempty (a string or array); cross-module-evidence-receipt: `stub_internal_contracts` equals false.
