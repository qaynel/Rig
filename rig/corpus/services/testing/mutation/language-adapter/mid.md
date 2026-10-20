# testing.mutation.language-adapter — mid

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: language-adapter-source-code-boundary, language-adapter-mutation-context.

List at least one value for `compiler_command`. Name the repository’s actual syntax-check command and version; a generic command may not cover every source dialect.

This remains configuration review. A value in `rig-services/testing.mutation.language-adapter.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.language-adapter:mid:language-adapter-source-code-boundary+language-adapter-mutation-context.

Check: `language-adapter-mutation-context`.
