# development.code-quality.correctness-static — behavior-oracle slice

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Policy grade slice `correctness-static-slice-behavior-oracle`: Record the exact analyzer command the repository runs. A missing command means a setup gap, not a clean result, so declare the real invocation. Despite its name this slice is not a behavior oracle: it confirms the analyzer command, enabled rules and failure handling are declared; it does not show the analyzer ran or found nothing.
