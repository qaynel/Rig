# testing.mutation.score-metrics — floor slice

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Assurance remains Policy grade.

Require the configured minimum number of killed mutants before publishing a sensitivity result. Configuration validation only, so it confirms killed and valid mutant counts and the invalid-in-score flag are declared; it does not compute a score.
