# development.code-quality.correctness-static — maximal

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: correctness-static-source-code-boundary, correctness-static-code-quality-context, correctness-static-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:development.code-quality.correctness-static:maximal:correctness-static-source-code-boundary+correctness-static-code-quality-context+correctness-static-evidence-receipt.

Declared predicates: correctness-static-source-code-boundary: `analyzer_command` is nonempty (a string or array); correctness-static-code-quality-context: `enabled_rules` is nonempty (a string or array); correctness-static-evidence-receipt: `ignore_analyzer_failure` equals false.
