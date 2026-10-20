# testing.test-data.fixtures-factories — property-floor slice

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Policy grade slice. This slice bounds fixtures factories to test-data.fixtures-factories. It uses `fixtures-factories-slice-property-floor` and checks fixture_defaults (nonempty): fixture defaults must name the concrete repository contract.