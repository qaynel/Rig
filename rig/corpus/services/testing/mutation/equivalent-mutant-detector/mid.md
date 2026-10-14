# testing.mutation.equivalent-mutant-detector — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for equivalent mutant detector; it does not widen ownership beyond mutation.equivalent-mutant-detector. The context signals are review_owners. Binding checks: equivalent-mutant-detector-mutation-context.

Ground the decision in the existing repository's equivalent mutant detector convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:repository-context. Given mutation.equivalent-mutant-detector has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Owned scope: `mutation.equivalent-mutant-detector`.

Offer: Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Input: `rig-services/testing.mutation.equivalent-mutant-detector.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

minimal: equivalence evidence — ["unreachable branch by domain proof"].

mid: review owners — ["parser maintainer"].

maximal: classify by survival only — false.
