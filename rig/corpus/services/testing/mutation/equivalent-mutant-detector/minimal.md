# testing.mutation.equivalent-mutant-detector — minimal

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no equivalence_evidence: the bad fixture has `equivalence_evidence` = `[]`, while the accepted fixture has `equivalence_evidence` = `["unreachable branch by domain proof"]`.

List at least one value for `equivalence_evidence`. The result says only that the configured operator or input is present. Evidence text must identify a reason to investigate equivalence, not merely repeat that tests passed.

Input: `rig-services/testing.mutation.equivalent-mutant-detector.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.equivalent-mutant-detector:minimal:equivalent-mutant-detector-source-code-boundary.

Declared predicates: equivalent-mutant-detector-source-code-boundary: `equivalence_evidence` is nonempty (a string or array).

Check: `equivalent-mutant-detector-source-code-boundary`.
