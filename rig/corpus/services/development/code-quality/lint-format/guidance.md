# lint-format

The repository agent inventories every component and records its chosen command
roles, exclusions, and diff/repo scope in `rig-lint-format.json` before proposal.
Commands use argv arrays, repository rule-source paths, and a `{files}` argument
for exact changed-file checks. An unfamiliar tool needs no catalogue entry.
Ambiguous roles require a user choice. Existing configuration is preserved.

Policy runs the approved read-only formatter check on the selected files;
Context retains Policy and adds approved lint execution plus a current semantic
review. Evidence retains those checks and independently replays commands,
recording input, review, and output digests in a receipt. Missing tools and
unsupported scopes are explicit nonzero gaps with setup guidance.

Declaration predicates in `rig-services/development.code-quality.lint-format.json`
are configuration checks only and cannot replace executable lint-format checks.
Excluded and uncovered paths remain unprotected. Fixes require separate approval.
