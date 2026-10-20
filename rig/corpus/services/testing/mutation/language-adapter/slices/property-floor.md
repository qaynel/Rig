# testing.mutation.language-adapter — property-floor slice

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Assurance remains Policy grade.

This slice verifies the configured `source_extensions` rule using `language-adapter-slice-property-floor`. Declare which source extensions and compiler or parser command the mutation adapter can handle.

The accepted fixture contains `source_extensions` = `[".js"]`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
