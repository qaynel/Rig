# testing.test-data.fixtures-factories — behavior-oracle slice

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Policy grade slice `fixtures-factories-slice-behavior-oracle`: Keep fixture defaults valid and list them. Invalid defaults hide the scenario, so declare the baseline record. Despite its name this slice is not a behavior oracle: it confirms fixture defaults, explicit variants and the shared-mutable-state flag are declared; it does not build fixtures.
