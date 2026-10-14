# development.code-quality.lint-format — minimal

Minimal establishes a non-vacuous policy boundary for lint format. It checks format_command (nonempty): format command must name the concrete repository contract..

Start from a repository-owned command or existing native check that can observe code-quality.lint-format; bind it to the input named in `rig-services/development.code-quality.lint-format.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside code-quality.lint-format is a failure.

Acceptance target: fixture:development.code-quality.lint-format:policy-boundary. Given source-code is present and development.code-quality.lint-format is selected, pass only when the repository binding evaluates development.code-quality.lint-format and returns zero; fail when its binding is absent, unreadable, exits nonzero, or claims work outside code-quality.lint-format. A passing policy check does not establish runtime behavior.
