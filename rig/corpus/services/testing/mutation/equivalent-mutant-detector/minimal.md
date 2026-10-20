# testing.mutation.equivalent-mutant-detector — minimal

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Grade: minimal. Assurance remains Policy grade.

Evidence text must identify a reason to investigate equivalence, not merely repeat that tests passed.

Input: `rig-services/testing.mutation.equivalent-mutant-detector.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms equivalence evidence, review owners and the survival-only flag are declared; it does not analyze mutants.

Acceptance target: policy:testing.mutation.equivalent-mutant-detector:minimal:equivalent-mutant-detector-source-code-boundary.

Declared predicates: equivalent-mutant-detector-source-code-boundary: `equivalence_evidence` is nonempty (a string or array).

Check: `equivalent-mutant-detector-source-code-boundary`.
