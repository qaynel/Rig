# testing.mutation.ci-gate-policy — floor slice

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Assurance remains Policy grade.

Choose the minimum score before evaluating a run; the example threshold is 70 percent. Configuration validation only, so it confirms a score threshold, a timeout policy and the unrun-mutant flag are declared; it does not run mutation testing.
