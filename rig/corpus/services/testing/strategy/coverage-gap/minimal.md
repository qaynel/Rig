# testing.strategy.coverage-gap — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for coverage gap. It checks uncovered_behaviors (nonempty): uncovered behaviors must name the concrete repository contract.. Binding checks: coverage-gap-source-code-boundary.

Start from a repository-owned command or existing native check that can observe strategy.coverage-gap; bind it to the input named in `rig-services/testing.strategy.coverage-gap.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside strategy.coverage-gap is a failure.

Acceptance target: fixture:testing.strategy.coverage-gap:policy-boundary. Given source-code is present and strategy.coverage-gap is selected, pass only when the repository binding evaluates strategy.coverage-gap and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Owned scope: `strategy.coverage-gap`.

Offer: Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Input: `rig-services/testing.strategy.coverage-gap.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Select an approved repository-owned command to verify that behavior.

minimal: uncovered behaviors — ["expired token"].

mid: risk owners — ["auth team"].

maximal: claim complete from line coverage — false.
