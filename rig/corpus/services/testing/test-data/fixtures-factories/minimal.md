# testing.test-data.fixtures-factories — minimal

Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for fixtures factories. The minimal boundary for fixtures factories checks fixture_defaults (nonempty): fixture defaults must name the concrete repository contract. Binding checks: fixtures-factories-source-code-boundary.

Start from a repository-owned command or existing native check that can observe test-data.fixtures-factories; bind it to the input named in `rig-services/testing.test-data.fixtures-factories.json` and preserve the check's failure status. When adopting this in an existing repository, connect fixtures factories to the command that inspects fixture_defaults and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside test-data.fixtures-factories as a failure.

Acceptance target: policy:testing.test-data.fixtures-factories:minimal:fixtures-factories-source-code-boundary.

Declared predicates: fixtures-factories-source-code-boundary: `fixture_defaults` is nonempty (a string or array).
