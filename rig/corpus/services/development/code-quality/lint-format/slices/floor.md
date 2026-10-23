# development.code-quality.lint-format — floor and mutation-floor slice

Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Policy grade slice `lint-format-slice-floor`: Declare the component's own formatter command. Without it formatting cannot be verified read-only, so reuse the repository's existing task.
