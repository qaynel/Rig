# development.code-quality.correctness-static — maximal

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Policy grade, maximal: Set ignoring analyzer failure to false. A crashing analyzer must stay non-passing, otherwise a broken run reads as clean. Cumulative with minimal and mid. Binding checks: correctness-static-source-code-boundary, correctness-static-code-quality-context, correctness-static-evidence-receipt.

Acceptance target: policy:development.code-quality.correctness-static:maximal:correctness-static-source-code-boundary+correctness-static-code-quality-context+correctness-static-evidence-receipt.
Declared predicates: correctness-static-source-code-boundary: `analyzer_command` is nonempty (a string or array); correctness-static-code-quality-context: `enabled_rules` is nonempty (a string or array); correctness-static-evidence-receipt: `ignore_analyzer_failure` equals false.
