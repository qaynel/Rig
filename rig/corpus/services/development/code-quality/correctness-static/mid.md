# development.code-quality.correctness-static — mid

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Policy grade, mid: List the correctness rules enabled for the language. An empty set analyzes nothing, so name the rule sets or checks in force. Cumulative with minimal. Binding checks: correctness-static-source-code-boundary, correctness-static-code-quality-context.

Acceptance target: policy:development.code-quality.correctness-static:mid:correctness-static-source-code-boundary+correctness-static-code-quality-context.
Declared predicates: correctness-static-source-code-boundary: `analyzer_command` is nonempty (a string or array); correctness-static-code-quality-context: `enabled_rules` is nonempty (a string or array).
