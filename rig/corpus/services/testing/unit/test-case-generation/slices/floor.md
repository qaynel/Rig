# testing.unit.test-case-generation — floor and mutation-floor slice

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Policy grade slice. This slice bounds test case generation to unit.test-case-generation. It uses `test-case-generation-slice-floor` and checks behavior_cases (nonempty): behavior cases must name the concrete repository contract.