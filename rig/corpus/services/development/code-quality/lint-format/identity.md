# development.code-quality.lint-format — identity

Policy grade: lint-format owns `code-quality.lint-format` on the `source-code` surface. Reuse component-owned formatter and lint tasks; read-only checks preserve source bytes and modes, and fixes need separate approval.

Disposition: executable. Native declarations in `rig-services/development.code-quality.lint-format.json` validate configuration only. Approved component setup binds actual formatter/linter commands. Policy observes those commands; Context additionally requires a current review with an explicit verdict; Evidence additionally replays commands and records a bound receipt. A requested grade never creates assurance on its own.

Typecheck, correctness-static-analysis, complexity-static and code-quality.code-review are adjacent exclusions. Lint-format does not replace their contracts or infer their outcomes from a formatter pass.
