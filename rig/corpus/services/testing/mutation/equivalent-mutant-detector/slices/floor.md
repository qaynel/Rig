# testing.mutation.equivalent-mutant-detector — floor slice

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Assurance remains Policy grade.

This Policy slice checks `equivalence_evidence` through `equivalent-mutant-detector-slice-floor`. The good fixture supplies `equivalence_evidence` = `["unreachable branch by domain proof"]`; the bad fixture removes it.

Evidence text must identify a reason to investigate equivalence, not merely repeat that tests passed. Keep the failure attached to `rig-services/testing.mutation.equivalent-mutant-detector.json`; do not infer that a mutation was generated or killed. equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.
