# testing.test-data.fixtures-factories — identity

Policy grade: fixtures factories owns test-data.fixtures-factories. Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Keep neighboring test-data services outside the fixtures factories decision for test-data.fixtures-factories. Ground the decision in the configured input at `rig-services/testing.test-data.fixtures-factories.json`; malformed input is still attributed to that path.

Disposition: executable. Use the limit: fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Choose a repository-owned check that observes fixtures factories from rig-services/testing.test-data.fixtures-factories.json.

Acceptance target: policy:testing.test-data.fixtures-factories:minimal:fixtures-factories-source-code-boundary.

Declared predicates: fixtures-factories-source-code-boundary: `fixture_defaults` is nonempty (a string or array).
