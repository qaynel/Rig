# testing.test-data.fixtures-factories — identity

fixtures factories owns test-data.fixtures-factories. Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Keep sibling services in test-data under their own verdicts. Ground the decision in the configured input at `rig-services/testing.test-data.fixtures-factories.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.test-data.fixtures-factories:policy-boundary. Given source-code is present and test-data.fixtures-factories is selected, pass only when the repository binding evaluates test-data.fixtures-factories and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern.
