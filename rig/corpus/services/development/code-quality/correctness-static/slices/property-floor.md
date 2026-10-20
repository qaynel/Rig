# development.code-quality.correctness-static — property-floor slice

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Policy grade slice. This slice bounds correctness static to correctness-static-analysis, complexity-static. It uses `correctness-static-slice-property-floor` and checks analyzer_command (nonempty): analyzer command must name the concrete repository contract.