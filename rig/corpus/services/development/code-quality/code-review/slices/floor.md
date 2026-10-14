# development.code-quality.code-review — floor and mutation-floor slice

Policy grade slice. This slice bounds code review to code-quality.code-review. It uses `code-review-slice-floor` and checks review_scope (nonempty): review scope must name the concrete repository contract..

For code review, choose a repository example that satisfies review_scope at the floor and mutation-floor floor, plus a failure where review scope must name the concrete repository contract. is false. For code review, wire `floor and mutation-floor` to `rig-services/development.code-quality.code-review.json` and keep its verdict on review_scope; missing evidence is a named gap, with ceiling code review configuration validation only; declared policy does not prove running code review behavior. Choose a repository-owned check that observes code review from rig-services/development.code-quality.code-review.json..

Service-specific evidence cues:
Offer: Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.
minimal: review scope — ["src"].
mid: required reviewers — 1.
maximal: unresolved findings allowed — false.
