# development.code-quality.correctness-static — mid

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: correctness-static-source-code-boundary, correctness-static-code-quality-context.

Acceptance target: policy:development.code-quality.correctness-static:mid:correctness-static-source-code-boundary+correctness-static-code-quality-context.

Declared predicates: correctness-static-source-code-boundary: `analyzer_command` is nonempty (a string or array); correctness-static-code-quality-context: `enabled_rules` is nonempty (a string or array).
