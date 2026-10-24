# development.code-quality.lint-format — mid

Grade: mid. Context includes `lint-format-formatter-clean` and `lint-format-linter-clean`. The component runner executes both approved formatter and linter commands before considering the review of the change.

The Context review must match the current request's file digests, rule-source digests and command inputs. It supplies a nonempty summary and an explicit `verdict` of `pass` or `fail`; findings name actual violations by file, rule source and meaning. A pass requires no violations. A failed review reports its findings and never advances to Evidence. Missing, stale or inconsistent review leaves Context incomplete.

The JSON predicate on `lint_command` is only declaration validation. It neither reads the changed code nor supplies this Context review. Type checking, correctness analysis and general code review retain their own service scopes.
