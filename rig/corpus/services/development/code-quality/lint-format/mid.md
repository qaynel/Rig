# development.code-quality.lint-format — mid

Mid adds repository context for lint format; it does not widen ownership beyond code-quality.lint-format. The context signals are lint_command.

Trace the verdict to the existing repository's lint format convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep code-quality.typecheck, correctness-static-analysis, complexity-static, code-quality.code-review outside this verdict.

Acceptance target: fixture:development.code-quality.lint-format:repository-context. Given development.code-quality.lint-format has a repository-specific convention and evidence source, pass only when the result identifies the consulted path or command and stays within code-quality.lint-format; fail when the result infers local convention without an inspectable source.
