# testing.mutation.language-adapter — maximal

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: language-adapter-source-code-boundary, language-adapter-mutation-context, language-adapter-evidence-receipt.

Keep `parse_errors_are_success` equal to false. Keep parse errors from counting as success; runtime proof requires executing the adapter on valid and invalid source examples.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.language-adapter:maximal:language-adapter-source-code-boundary+language-adapter-mutation-context+language-adapter-evidence-receipt.

Check: `language-adapter-evidence-receipt`.
