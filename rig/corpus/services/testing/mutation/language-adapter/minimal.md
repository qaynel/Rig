# testing.mutation.language-adapter — minimal

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Grade: minimal. Assurance remains Policy grade.

List a supported extension before the adapter attempts source transformation.

Input: `rig-services/testing.mutation.language-adapter.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms source extensions, a compiler command and the parse-error flag are declared; it does not compile anything.

Acceptance target: policy:testing.mutation.language-adapter:minimal:language-adapter-source-code-boundary.

Declared predicates: language-adapter-source-code-boundary: `source_extensions` is nonempty (a string or array).

Check: `language-adapter-source-code-boundary`.
