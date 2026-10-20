# testing.mutation.language-adapter — identity

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Policy grade. Declare which source extensions and compiler or parser command the mutation adapter can handle. A parse or compile error is a coverage gap, not a killed mutant or successful result.

Applicable surface: source-code.

Owned scope: `mutation.language-adapter`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. Configuration validation only, so it confirms source extensions, a compiler command and the parse-error flag are declared; it does not compile anything.

Policy checks: minimal requires `source_extensions` = `[".js"]`; mid adds `compiler_command` = `["node","--check"]`; maximal requires `parse_errors_are_success` = `false`.
