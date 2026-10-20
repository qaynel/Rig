# testing.mutation.language-adapter — minimal

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no source_extensions: the bad fixture has `source_extensions` = `[]`, while the accepted fixture has `source_extensions` = `[".js"]`.

List at least one value for `source_extensions`. The result says only that the configured operator or input is present. List a supported extension before the adapter attempts source transformation.

Input: `rig-services/testing.mutation.language-adapter.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.language-adapter:minimal:language-adapter-source-code-boundary.

Declared predicates: language-adapter-source-code-boundary: `source_extensions` is nonempty (a string or array).

Check: `language-adapter-source-code-boundary`.
