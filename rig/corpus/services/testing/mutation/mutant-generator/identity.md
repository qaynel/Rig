# testing.mutation.mutant-generator — identity

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Policy grade. Generate semantic production-code mutations while leaving assertions unchanged. Changing a test instead of production code can make a weak oracle appear sensitive.

Applicable surface: source-code.

Owned scope: `mutation.mutant-generator`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. Configuration validation only, so it confirms mutation operators, target paths and the mutate-tests flag are declared; it does not generate mutants.

Policy checks: minimal requires `mutation_operators` = `["negate conditional"]`; mid adds `target_paths` = `["src/parser.js"]`; maximal requires `mutate_test_code` = `false`.
