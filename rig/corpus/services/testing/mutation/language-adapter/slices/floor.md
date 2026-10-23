# testing.mutation.language-adapter — floor slice

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Assurance remains Policy grade.

List a supported extension before the adapter attempts source transformation. Configuration validation only, so it confirms source extensions, a compiler command and the parse-error flag are declared; it does not compile anything.
