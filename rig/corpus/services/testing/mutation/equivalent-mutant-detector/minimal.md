# testing.mutation.equivalent-mutant-detector — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for equivalent mutant detector. The minimal boundary for equivalent mutant detector checks equivalence_evidence (nonempty): equivalence evidence must name the concrete repository contract.. Binding checks: equivalent-mutant-detector-source-code-boundary.

Read a repository-owned command or existing native check that can observe mutation.equivalent-mutant-detector; bind it to the input named in `rig-services/testing.mutation.equivalent-mutant-detector.json` and preserve the check's failure status. When adopting this in an existing repository, connect equivalent mutant detector to the command that inspects equivalence_evidence and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside mutation.equivalent-mutant-detector as a failure.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:policy-boundary. Given source-code is present and mutation.equivalent-mutant-detector is selected, pass only when the repository binding evaluates mutation.equivalent-mutant-detector and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. The ceiling is equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Choose a repository-owned check that observes equivalent mutant detector from rig-services/testing.mutation.equivalent-mutant-detector.json..

Service-specific evidence cues:
Offer: Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.
minimal: equivalence evidence — ["unreachable branch by domain proof"].
mid: review owners — ["parser maintainer"].
maximal: classify by survival only — false.
