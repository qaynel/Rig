# development.code-quality.lint-format — identity

Policy grade: lint format owns code-quality.lint-format. Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

For lint format, keep code-quality.typecheck, correctness-static-analysis, complexity-static, code-quality.code-review outside its verdict. Ground the decision in the configured input at `rig-services/development.code-quality.lint-format.json`; malformed input is still attributed to that path.

Disposition: undefined. Use the limit: lint format configuration validation only; declared policy does not prove running lint format behavior. Choose a repository-owned check that observes lint format from rig-services/development.code-quality.lint-format.json.

Acceptance target: fixture:development.code-quality.lint-format:policy-boundary. Given source-code is present and development.code-quality.lint-format is selected, pass only when the repository binding evaluates development.code-quality.lint-format and returns zero; fail when its binding is absent, unreadable, exits nonzero, or claims work outside code-quality.lint-format.

Service-specific evidence cues:
Offer: Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.
minimal: format command — ["npm","run","format:check"].
mid: lint command — ["npm","run","lint"].
maximal: autofix during check — false.
