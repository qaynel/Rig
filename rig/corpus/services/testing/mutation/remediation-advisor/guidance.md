# remediation advisor

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Assurance remains Policy grade.

Propose behavior-level tests that would distinguish a survived mutation. An assertion that copies the implementation logic may preserve the same bug.

The policy input is `rig-services/testing.mutation.remediation-advisor.json`. Keep its configuration visible to review: minimal supplies `remediation_cases` = `["reject exact upper limit"]`; mid adds `target_behaviors` = `["limit enforcement"]`; maximal sets `add_implementation_mirrors` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
