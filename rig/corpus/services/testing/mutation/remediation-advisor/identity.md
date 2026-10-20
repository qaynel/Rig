# testing.mutation.remediation-advisor — identity

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Policy grade. Propose behavior-level tests that would distinguish a survived mutation. An assertion that copies the implementation logic may preserve the same bug.

Applicable surface: source-code.

Owned scope: `mutation.remediation-advisor`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Read `rig-services/testing.mutation.remediation-advisor.json`; malformed input remains attributable to that path. The good and bad fixtures show the configuration boundary, not a mutation run.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

Policy checks: minimal requires `remediation_cases` = `["reject exact upper limit"]`; mid adds `target_behaviors` = `["limit enforcement"]`; maximal requires `add_implementation_mirrors` = `false`.
