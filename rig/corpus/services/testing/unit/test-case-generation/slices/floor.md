# testing.unit.test-case-generation — floor and mutation-floor slice

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Policy grade slice `test-case-generation-slice-floor`: List the behaviors the cases cover. Cases tied to structure break on refactor, so describe observable behavior.
