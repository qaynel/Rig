# test-case-generation

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Owned scope: `unit.test-case-generation`. Input: `rig-services/testing.unit.test-case-generation.json`.

Coverage ceiling: Configuration validation only, so it confirms behavior cases, asserted outcomes and the implementation-detail flag are declared; it does not generate tests.

minimal: behavior cases — ["reject malformed input"]. List the behaviors the cases cover. Cases tied to structure break on refactor, so describe observable behavior.

mid: asserted outcomes — ["throws invalid record"]. State a concrete expected outcome per case. An assertion without an expected value proves nothing, so write it.

maximal: assert implementation details — false. Set asserting implementation details to false. Asserting private structure makes refactoring costly, so assert outputs.
