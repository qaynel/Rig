# testing.mutation.remediation-advisor — identity

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Policy grade. Propose behavior-level tests that would distinguish a survived mutation. An assertion that copies the implementation logic may preserve the same bug.

Applicable surface: source-code.

Owned scope: `mutation.remediation-advisor`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. Configuration validation only, so it confirms remediation cases, target behaviors and the implementation-mirror flag are declared; it does not write tests.

Policy checks: minimal requires `remediation_cases` = `["reject exact upper limit"]`; mid adds `target_behaviors` = `["limit enforcement"]`; maximal requires `add_implementation_mirrors` = `false`.
