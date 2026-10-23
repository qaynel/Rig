# testing.unit.test-case-generation — behavior-oracle slice

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Policy grade slice `test-case-generation-slice-behavior-oracle`: List the behaviors the cases cover. Cases tied to structure break on refactor, so describe observable behavior. Despite its name this slice is not a behavior oracle: it confirms behavior cases, asserted outcomes and the implementation-detail flag are declared; it does not generate tests.
