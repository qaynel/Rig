# testing.strategy.coverage-gap — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for coverage gap; it does not widen ownership beyond strategy.coverage-gap. For coverage gap, inspect these context signals: risk_owners. Binding checks: coverage-gap-strategy-context.

Trace the verdict to the existing repository's coverage gap convention, then name the source path or command that establishes it. For coverage gap, inspect the repository's actual spec, source, test, or configuration for risk_owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring strategy services outside the coverage gap decision for strategy.coverage-gap.

Acceptance target: fixture:testing.strategy.coverage-gap:repository-context. Given strategy.coverage-gap has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent strategy concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.
minimal: uncovered behaviors — ["expired token"].
mid: risk owners — ["auth team"].
maximal: claim complete from line coverage — false.
