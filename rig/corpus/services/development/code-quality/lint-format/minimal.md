# development.code-quality.lint-format — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for lint format. The minimal boundary for lint format checks format_command (nonempty): format command must name the concrete repository contract.. Binding checks: lint-format-formatter-clean.

Start from a repository-owned command or existing native check that can observe code-quality.lint-format; bind it to the input named in `rig-services/development.code-quality.lint-format.json` and preserve the check's failure status. When adopting this in an existing repository, connect lint format to the command that inspects format_command and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-quality.lint-format as a failure.

Acceptance target: fixture:development.code-quality.lint-format:policy-boundary. Given source-code is present and development.code-quality.lint-format is selected, pass only when the repository binding evaluates development.code-quality.lint-format and returns zero; fail when its binding is absent, unreadable, exits nonzero, or claims work outside code-quality.lint-format. The ceiling is lint format configuration validation only; declared policy does not prove running lint format behavior. Choose a repository-owned check that observes lint format from rig-services/development.code-quality.lint-format.json..

Service-specific evidence cues:
Offer: Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.
minimal: format command — ["npm","run","format:check"].
mid: lint command — ["npm","run","lint"].
maximal: autofix during check — false.
