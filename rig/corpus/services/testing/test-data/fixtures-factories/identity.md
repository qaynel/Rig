# testing.test-data.fixtures-factories — identity

Policy grade: fixtures factories owns test-data.fixtures-factories. Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Keep neighboring test-data services outside the fixtures factories decision for test-data.fixtures-factories. Ground the decision in the configured input at `rig-services/testing.test-data.fixtures-factories.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Choose a repository-owned check that observes fixtures factories from rig-services/testing.test-data.fixtures-factories.json.

Acceptance target: fixture:testing.test-data.fixtures-factories:policy-boundary. Given source-code is present and test-data.fixtures-factories is selected, pass only when the repository binding evaluates test-data.fixtures-factories and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern.

Service-specific evidence cues:
Offer: Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.
minimal: fixture defaults — ["valid account"].
mid: explicit variants — ["expired account"].
maximal: shared mutable state — false.
