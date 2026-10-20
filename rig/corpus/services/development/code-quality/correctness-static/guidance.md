# correctness-static

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Owned scope: `correctness-static-analysis, complexity-static`. Input: `rig-services/development.code-quality.correctness-static.json`.

Coverage ceiling: Configuration validation only, so it confirms the analyzer command, enabled rules and failure handling are declared; it does not show the analyzer ran or found nothing.

minimal: analyzer command — ["npm","run","analyze"]. Record the exact analyzer command the repository runs. A missing command means a setup gap, not a clean result, so declare the real invocation.

mid: enabled rules — ["null-dereference"]. List the correctness rules enabled for the language. An empty set analyzes nothing, so name the rule sets or checks in force.

maximal: ignore analyzer failure — false. Set ignoring analyzer failure to false. A crashing analyzer must stay non-passing, otherwise a broken run reads as clean.
