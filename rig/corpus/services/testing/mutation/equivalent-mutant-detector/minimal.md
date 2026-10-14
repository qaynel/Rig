# testing.mutation.equivalent-mutant-detector — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for equivalent mutant detector. It checks equivalence_evidence (nonempty): equivalence evidence must name the concrete repository contract.. Binding checks: equivalent-mutant-detector-source-code-boundary.

Read a repository-owned command or existing native check that can observe mutation.equivalent-mutant-detector; bind it to the input named in `rig-services/testing.mutation.equivalent-mutant-detector.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.equivalent-mutant-detector is a failure.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:policy-boundary. Given source-code is present and mutation.equivalent-mutant-detector is selected, pass only when the repository binding evaluates mutation.equivalent-mutant-detector and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Owned scope: `mutation.equivalent-mutant-detector`.

Offer: Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Input: `rig-services/testing.mutation.equivalent-mutant-detector.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

minimal: equivalence evidence — ["unreachable branch by domain proof"].

mid: review owners — ["parser maintainer"].

maximal: classify by survival only — false.
