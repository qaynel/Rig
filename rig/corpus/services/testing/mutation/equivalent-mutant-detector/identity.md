# testing.mutation.equivalent-mutant-detector — identity

Policy grade: equivalent mutant detector owns mutation.equivalent-mutant-detector. Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Keep sibling services in mutation under their own verdicts. Inspect the configured input at `rig-services/testing.mutation.equivalent-mutant-detector.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:policy-boundary. Given source-code is present and mutation.equivalent-mutant-detector is selected, pass only when the repository binding evaluates mutation.equivalent-mutant-detector and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.

Service-specific evidence cues:
Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Owned scope: `mutation.equivalent-mutant-detector`.

Offer: Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Input: `rig-services/testing.mutation.equivalent-mutant-detector.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

minimal: equivalence evidence — ["unreachable branch by domain proof"].

mid: review owners — ["parser maintainer"].

maximal: classify by survival only — false.
