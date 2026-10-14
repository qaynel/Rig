# development.code-quality.correctness-static — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for correctness static; it does not widen ownership beyond correctness-static-analysis, complexity-static. For correctness static, inspect these context signals: enabled_rules. Binding checks: correctness-static-code-quality-context.

Anchor the review on the existing repository's correctness static convention, then name the source path or command that establishes it. For correctness static, inspect the repository's actual spec, source, test, or configuration for enabled_rules; if none governs that evidence, record the gap instead of inferring a convention. For correctness static, keep security-sast, sast outside its verdict.

Acceptance target: fixture:development.code-quality.correctness-static:repository-context. Given correctness-static-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes security-sast; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.
minimal: analyzer command — ["npm","run","analyze"].
mid: enabled rules — ["null-dereference"].
maximal: ignore analyzer failure — false.
