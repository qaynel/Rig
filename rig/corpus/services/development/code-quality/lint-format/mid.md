# development.code-quality.lint-format — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for lint format; it does not widen ownership beyond code-quality.lint-format. The context signals are lint_command. Binding checks: lint-format-linter-clean.

Trace the verdict to the existing repository's lint format convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep code-quality.typecheck, correctness-static-analysis, complexity-static, code-quality.code-review outside this verdict.

Acceptance target: fixture:development.code-quality.lint-format:repository-context. Given development.code-quality.lint-format has a repository-specific convention and evidence source, pass only when the result identifies the consulted path or command and stays within code-quality.lint-format; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Owned scope: `code-quality.lint-format`.

Offer: Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Input: `rig-services/development.code-quality.lint-format.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: lint format configuration validation only; declared policy does not prove running lint format behavior. Select an approved repository-owned command to verify that behavior.

minimal: format command — ["npm","run","format:check"].

mid: lint command — ["npm","run","lint"].

maximal: autofix during check — false.
