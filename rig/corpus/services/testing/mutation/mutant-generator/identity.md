# testing.mutation.mutant-generator — identity

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Policy grade. Generate semantic production-code mutations while leaving assertions unchanged. Changing a test instead of production code can make a weak oracle appear sensitive.

Applicable surface: source-code.

Owned scope: `mutation.mutant-generator`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Read `rig-services/testing.mutation.mutant-generator.json`; malformed input remains attributable to that path. The good and bad fixtures show the configuration boundary, not a mutation run.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.

Policy checks: minimal requires `mutation_operators` = `["negate conditional"]`; mid adds `target_paths` = `["src/parser.js"]`; maximal requires `mutate_test_code` = `false`.
