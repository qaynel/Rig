# language adapter

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Assurance remains Policy grade.

Declare which source extensions and compiler or parser command the mutation adapter can handle. A parse or compile error is a coverage gap, not a killed mutant or successful result.

The policy input is `rig-services/testing.mutation.language-adapter.json`. Keep its configuration visible to review: minimal supplies `source_extensions` = `[".js"]`; mid adds `compiler_command` = `["node","--check"]`; maximal sets `parse_errors_are_success` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
