# Lint and format enforcement

`development.code-quality.lint-format` owns whether source changes satisfy the
repository's chosen formatter and linter conventions. It adapts to commands the
repository already defines; it neither selects nor installs a language-specific
toolchain.

This service excludes type-system rigor, correctness and complexity analysis,
security scanning, and human code review. Those remain the adjacent
`typecheck`, `correctness-static`, Product-Security SAST, and `code-review`
services. It applies to repositories containing source code and is recommended
when a supported repository-native command can be discovered.

There are no service dependencies. A missing or malformed formatter/linter
command is a named, nonzero coverage gap rather than a silent skip or a
fabricated pass.
