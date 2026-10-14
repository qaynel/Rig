# development.code-quality.lint-format — identity

lint format owns code-quality.lint-format. Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Keep code-quality.typecheck, correctness-static-analysis, complexity-static, code-quality.code-review outside this verdict. Ground the decision in the configured input at `rig-services/development.code-quality.lint-format.json`; malformed input is still attributed to that path.

Disposition: undefined. Use the limit: lint format configuration validation only; declared policy does not prove running lint format behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-quality.lint-format:policy-boundary. Given source-code is present and development.code-quality.lint-format is selected, pass only when the repository binding evaluates development.code-quality.lint-format and returns zero; fail when its binding is absent, unreadable, exits nonzero, or claims work outside code-quality.lint-format.
