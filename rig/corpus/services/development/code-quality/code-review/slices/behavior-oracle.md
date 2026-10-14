# development.code-quality.code-review — behavior-oracle slice

Policy grade slice. This slice bounds code review to code-quality.code-review. It uses `code-review-slice-behavior-oracle` and checks review_scope (nonempty): review scope must name the concrete repository contract..

Use a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-quality.code-review.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than code review configuration validation only; declared policy does not prove running code review behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Owned scope: `code-quality.code-review`.

Offer: Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Input: `rig-services/development.code-quality.code-review.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: code review configuration validation only; declared policy does not prove running code review behavior. Select an approved repository-owned command to verify that behavior.

minimal: review scope — ["src"].

mid: required reviewers — 1.

maximal: unresolved findings allowed — false.
