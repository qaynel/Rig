# development.code-quality.correctness-static — floor and mutation-floor slice

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Policy grade slice `correctness-static-slice-floor`: Record the exact analyzer command the repository runs. A missing command means a setup gap, not a clean result, so declare the real invocation.
