# development.code-quality.correctness-static — identity

Policy grade: correctness-static owns correctness-static-analysis, complexity-static. Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Input: `rig-services/development.code-quality.correctness-static.json`. Configuration validation only, so it confirms the analyzer command, enabled rules and failure handling are declared; it does not show the analyzer ran or found nothing.

Disposition: executable.
Acceptance target: policy:development.code-quality.correctness-static:minimal:correctness-static-source-code-boundary.
Declared predicates: correctness-static-source-code-boundary: `analyzer_command` is nonempty (a string or array).
