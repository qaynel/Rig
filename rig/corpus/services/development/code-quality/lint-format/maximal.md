# development.code-quality.lint-format — maximal

Grade: maximal. Evidence retains `lint-format-formatter-clean` and `lint-format-linter-clean`, then adds `lint-format-ci-gate-and-explicit-fix` at its applicable boundary. A clean request-bound Context review is required before local Evidence replay.

The local runner re-executes the approved commands and compares observed exit statuses, output digests and unchanged input digests. It writes a receipt binding those observations and the Context review. A changed file, changed rule, mismatched replay, source mutation or failed Context verdict prevents an Evidence pass.

CI integration uses the shared additive adapter and separate approval. Missing CI is reported as not installed; it does not fabricate a local replay result. Autofix remains a separately approved operation. The JSON `autofix_during_check` predicate alone validates configuration, not any replay or CI execution.
