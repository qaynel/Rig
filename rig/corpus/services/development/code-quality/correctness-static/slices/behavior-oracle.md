# development.code-quality.correctness-static — behavior-oracle slice

Policy grade slice. This slice bounds correctness static to correctness-static-analysis, complexity-static. It uses `correctness-static-slice-behavior-oracle` and checks analyzer_command (nonempty): analyzer command must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-quality.correctness-static.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than correctness static configuration validation only; declared policy does not prove running correctness static behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Owned scope: `correctness-static-analysis`, `complexity-static`.

Offer: Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Input: `rig-services/development.code-quality.correctness-static.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: correctness static configuration validation only; declared policy does not prove running correctness static behavior. Select an approved repository-owned command to verify that behavior.

minimal: analyzer command — ["npm","run","analyze"].

mid: enabled rules — ["null-dereference"].

maximal: ignore analyzer failure — false.
