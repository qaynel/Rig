# testing.mutation.language-adapter — maximal

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Policy grade, maximal: Set parse errors counting as success to false. A mutant that fails to parse is a gap, not a result, so report it. Cumulative with minimal and mid. Binding checks: language-adapter-source-code-boundary, language-adapter-mutation-context, language-adapter-evidence-receipt.
