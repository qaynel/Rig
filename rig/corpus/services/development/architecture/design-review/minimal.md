# development.architecture.design-review — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for design review. The minimal boundary for design review checks reviewed_interfaces (nonempty): reviewed interfaces must name the concrete repository contract.. Binding checks: design-review-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe architecture.design-review; bind it to the input named in `rig-services/development.architecture.design-review.json` and preserve the check's failure status. When adopting this in an existing repository, connect design review to the command that inspects reviewed_interfaces and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside architecture.design-review as a failure.

Acceptance target: fixture:development.architecture.design-review:policy-boundary. Given source-code is present and architecture.design-review is selected, pass only when the repository binding evaluates architecture.design-review and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern. The ceiling is design review configuration validation only; declared policy does not prove running design review behavior. Choose a repository-owned check that observes design review from rig-services/development.architecture.design-review.json..

Service-specific evidence cues:
Offer: Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.
minimal: reviewed interfaces — ["items API"].
mid: tradeoffs — ["latency versus durability"].
maximal: unresolved tradeoffs — 0.
