# testing.mutation.equivalent-mutant-detector — identity

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Policy grade. Record evidence and human ownership before classifying a mutant as behaviorally equivalent. A surviving mutant may expose a missing assertion; survival alone is not an equivalence proof.

Applicable surface: source-code.

Owned scope: `mutation.equivalent-mutant-detector`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Read `rig-services/testing.mutation.equivalent-mutant-detector.json`; malformed input remains attributable to that path. The good and bad fixtures show the configuration boundary, not a mutation run.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

Policy checks: minimal requires `equivalence_evidence` = `["unreachable branch by domain proof"]`; mid adds `review_owners` = `["parser maintainer"]`; maximal requires `classify_by_survival_only` = `false`.
