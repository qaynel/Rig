# development.code-quality.correctness-static — mid

Mid adds repository context for correctness static; it does not widen ownership beyond correctness-static-analysis, complexity-static. The context signals are enabled_rules.

Anchor the review on the existing repository's correctness static convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep security-sast, sast outside this verdict.

Acceptance target: fixture:development.code-quality.correctness-static:repository-context. Given correctness-static-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes security-sast; fail when the result infers local convention without an inspectable source.
