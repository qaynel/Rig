# mutant generator

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Assurance remains Policy grade.

Generate semantic production-code mutations while leaving assertions unchanged. Changing a test instead of production code can make a weak oracle appear sensitive.

The policy input is `rig-services/testing.mutation.mutant-generator.json`. Keep its configuration visible to review: minimal supplies `mutation_operators` = `["negate conditional"]`; mid adds `target_paths` = `["src/parser.js"]`; maximal sets `mutate_test_code` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
