# testing.test-data.fixtures-factories — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for fixtures factories. The evidence must preserve the fixture_defaults, explicit_variants, shared_mutable_state inputs that determined the result. Binding checks: fixtures-factories-evidence-receipt.

Anchor the review on a second run against unchanged fixtures factories inputs. Record the fixture_defaults, explicit_variants, shared_mutable_state inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this fixtures factories result is stale. The ceiling remains: fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Choose a repository-owned check that observes fixtures factories from rig-services/testing.test-data.fixtures-factories.json.

Acceptance target: fixture:testing.test-data.fixtures-factories:evidence-replay. Given the test-data.fixtures-factories binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.
minimal: fixture defaults — ["valid account"].
mid: explicit variants — ["expired account"].
maximal: shared mutable state — false.
