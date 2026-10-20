# testing.integration.cross-module — maximal

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Policy grade, maximal: Set stubbing internal contracts to false. A stubbed internal boundary defeats the integration check, so exercise the real module. Cumulative with minimal and mid. Binding checks: cross-module-source-code-boundary, cross-module-integration-context, cross-module-evidence-receipt.

Acceptance target: policy:testing.integration.cross-module:maximal:cross-module-source-code-boundary+cross-module-integration-context+cross-module-evidence-receipt.
Declared predicates: cross-module-source-code-boundary: `participating_modules` is nonempty (a string or array); cross-module-integration-context: `interaction_cases` is nonempty (a string or array); cross-module-evidence-receipt: `stub_internal_contracts` equals false.
