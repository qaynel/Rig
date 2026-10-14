# development.code-quality.code-review — floor and mutation-floor slice

This slice bounds code review to code-quality.code-review. It uses `code-review-slice-floor` and checks review_scope (nonempty): review scope must name the concrete repository contract..

Start from a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-quality.code-review.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than code review configuration validation only; declared policy does not prove running code review behavior. Select an approved repository-owned command to verify that behavior.
