# development.code-quality.correctness-static — floor and mutation-floor slice

Policy grade slice. This slice bounds correctness static to correctness-static-analysis, complexity-static. It uses `correctness-static-slice-floor` and checks analyzer_command (nonempty): analyzer command must name the concrete repository contract..

For correctness static, choose a repository example that satisfies analyzer_command at the floor and mutation-floor floor, plus a failure where analyzer command must name the concrete repository contract. is false. For correctness static, wire `floor and mutation-floor` to `rig-services/development.code-quality.correctness-static.json` and keep its verdict on analyzer_command; missing evidence is a named gap, with ceiling correctness static configuration validation only; declared policy does not prove running correctness static behavior. Choose a repository-owned check that observes correctness static from rig-services/development.code-quality.correctness-static.json..

Service-specific evidence cues:
Offer: Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.
minimal: analyzer command — ["npm","run","analyze"].
mid: enabled rules — ["null-dereference"].
maximal: ignore analyzer failure — false.
