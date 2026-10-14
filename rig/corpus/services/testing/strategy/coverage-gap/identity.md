# testing.strategy.coverage-gap — identity

Policy grade: coverage gap owns strategy.coverage-gap. Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Keep sibling services in strategy under their own verdicts. Ground the decision in the configured input at `rig-services/testing.strategy.coverage-gap.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.strategy.coverage-gap:policy-boundary. Given source-code is present and strategy.coverage-gap is selected, pass only when the repository binding evaluates strategy.coverage-gap and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern.

Service-specific evidence cues:
Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Owned scope: `strategy.coverage-gap`.

Offer: Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Input: `rig-services/testing.strategy.coverage-gap.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Select an approved repository-owned command to verify that behavior.

minimal: uncovered behaviors — ["expired token"].

mid: risk owners — ["auth team"].

maximal: claim complete from line coverage — false.
