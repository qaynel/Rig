# development.code-quality.lint-format — behavior-oracle slice

Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Policy grade slice `lint-format-slice-behavior-oracle`: Declare the component's own formatter command. Without it formatting cannot be verified read-only, so reuse the repository's existing task. Despite its name this slice is not a behavior oracle: it confirms the format and lint commands and the autofix setting are declared; it does not show the sources are formatted or lint-clean.
