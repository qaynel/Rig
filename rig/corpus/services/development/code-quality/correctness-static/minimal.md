# development.code-quality.correctness-static — minimal

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Policy grade, minimal: Record the exact analyzer command the repository runs. A missing command means a setup gap, not a clean result, so declare the real invocation. Binding checks: correctness-static-source-code-boundary.

Acceptance target: policy:development.code-quality.correctness-static:minimal:correctness-static-source-code-boundary.
Declared predicates: correctness-static-source-code-boundary: `analyzer_command` is nonempty (a string or array).
