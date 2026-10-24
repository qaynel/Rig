# testing.test-data.fixtures-factories — identity

Policy grade: fixtures-factories owns test-data.fixtures-factories. Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Input: `rig-services/testing.test-data.fixtures-factories.json`. Configuration validation only, so it confirms fixture defaults, explicit variants and the shared-mutable-state flag are declared; it does not build fixtures.

Disposition: executable.
Acceptance target: policy:testing.test-data.fixtures-factories:minimal:fixtures-factories-source-code-boundary.
Declared predicates: fixtures-factories-source-code-boundary: `fixture_defaults` is nonempty (a string or array).
