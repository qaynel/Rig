# development.code-quality.lint-format — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid addition — linter cleanliness adds repository context for lint format; it does not widen ownership beyond code-quality.lint-format. For lint format, inspect these context signals: lint_command. Binding checks: lint-format-linter-clean.

Trace the verdict to the existing repository's lint format convention, then name the source path or command that establishes it. For lint format, inspect the repository's actual spec, source, test, or configuration for lint_command; if none governs that evidence, record the gap instead of inferring a convention. For lint format, keep code-quality.typecheck, correctness-static-analysis, complexity-static, code-quality.code-review outside its verdict.

Acceptance target: fixture:development.code-quality.lint-format:repository-context. Given development.code-quality.lint-format has a repository-specific convention and evidence source, pass only when the result identifies the consulted path or command and stays within code-quality.lint-format; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.
minimal: format command — ["npm","run","format:check"].
mid: lint command — ["npm","run","lint"].
maximal: autofix during check — false.
