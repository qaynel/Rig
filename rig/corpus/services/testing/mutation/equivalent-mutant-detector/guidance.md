# equivalent mutant detector

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Assurance remains Policy grade.

Record evidence and human ownership before classifying a mutant as behaviorally equivalent. A surviving mutant may expose a missing assertion; survival alone is not an equivalence proof.

The policy input is `rig-services/testing.mutation.equivalent-mutant-detector.json`. Keep its configuration visible to review: minimal supplies `equivalence_evidence` = `["unreachable branch by domain proof"]`; mid adds `review_owners` = `["parser maintainer"]`; maximal sets `classify_by_survival_only` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
