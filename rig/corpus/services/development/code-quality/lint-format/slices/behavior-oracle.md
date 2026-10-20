# development.code-quality.lint-format — behavior-oracle slice

Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Policy grade slice. This slice bounds lint format to code-quality.lint-format. It uses `lint-format-slice-behavior-oracle` and checks format_command (nonempty): format command must name the concrete repository contract.