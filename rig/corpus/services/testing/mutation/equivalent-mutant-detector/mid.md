# testing.mutation.equivalent-mutant-detector — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for equivalent mutant detector; it does not widen ownership beyond mutation.equivalent-mutant-detector. For equivalent mutant detector, inspect these context signals: review_owners. Binding checks: equivalent-mutant-detector-mutation-context.

Ground the decision in the existing repository's equivalent mutant detector convention, then name the source path or command that establishes it. For equivalent mutant detector, inspect the repository's actual spec, source, test, or configuration for review_owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the equivalent mutant detector decision for mutation.equivalent-mutant-detector.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:repository-context. Given mutation.equivalent-mutant-detector has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.
minimal: equivalence evidence — ["unreachable branch by domain proof"].
mid: review owners — ["parser maintainer"].
maximal: classify by survival only — false.
