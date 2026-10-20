# development.code-quality.correctness-static — minimal

Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for correctness static. The minimal boundary for correctness static checks analyzer_command (nonempty): analyzer command must name the concrete repository contract. Binding checks: correctness-static-source-code-boundary.

Acceptance target: policy:development.code-quality.correctness-static:minimal:correctness-static-source-code-boundary.

Declared predicates: correctness-static-source-code-boundary: `analyzer_command` is nonempty (a string or array).
