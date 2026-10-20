# lint-format

Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Owned scope: `code-quality.lint-format` on the `source-code` surface`. Input: `rig-services/development.code-quality.lint-format.json`.

Coverage ceiling: Configuration validation only, so it confirms the format and lint commands and the autofix setting are declared; it does not show the sources are formatted or lint-clean.

minimal: format command — ["npm","run","format:check"]. Declare the component's own formatter command. Without it formatting cannot be verified read-only, so reuse the repository's existing task.

mid: lint command — ["npm","run","lint"]. Declare the component's own lint command. A missing command leaves lint unchecked, so reuse the repository's existing task.

maximal: autofix during check — false. Set autofix during a check to false. A check that rewrites source breaks the read-only guarantee, so run autofix only under a separate approved action.
