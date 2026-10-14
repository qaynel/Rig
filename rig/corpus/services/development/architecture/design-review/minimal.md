# development.architecture.design-review — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for design review. It checks reviewed_interfaces (nonempty): reviewed interfaces must name the concrete repository contract.. Binding checks: design-review-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe architecture.design-review; bind it to the input named in `rig-services/development.architecture.design-review.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside architecture.design-review is a failure.

Acceptance target: fixture:development.architecture.design-review:policy-boundary. Given source-code is present and architecture.design-review is selected, pass only when the repository binding evaluates architecture.design-review and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Owned scope: `architecture.design-review`.

Offer: Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Input: `rig-services/development.architecture.design-review.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.

minimal: reviewed interfaces — ["items API"].

mid: tradeoffs — ["latency versus durability"].

maximal: unresolved tradeoffs — 0.
