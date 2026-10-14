# correctness static

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Owned scope: `correctness-static-analysis`, `complexity-static`.

Offer: Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Input: `rig-services/development.code-quality.correctness-static.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: correctness static configuration validation only; declared policy does not prove running correctness static behavior. Select an approved repository-owned command to verify that behavior.

minimal: analyzer command — ["npm","run","analyze"].

mid: enabled rules — ["null-dereference"].

maximal: ignore analyzer failure — false.

