# testing.strategy.coverage-gap — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for coverage gap; it does not widen ownership beyond strategy.coverage-gap. The context signals are risk_owners. Binding checks: coverage-gap-strategy-context.

Trace the verdict to the existing repository's coverage gap convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in strategy under their own verdicts.

Acceptance target: fixture:testing.strategy.coverage-gap:repository-context. Given strategy.coverage-gap has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent strategy concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Owned scope: `strategy.coverage-gap`.

Offer: Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Input: `rig-services/testing.strategy.coverage-gap.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Select an approved repository-owned command to verify that behavior.

minimal: uncovered behaviors — ["expired token"].

mid: risk owners — ["auth team"].

maximal: claim complete from line coverage — false.
