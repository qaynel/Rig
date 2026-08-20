# Maximal addition — CI gate and explicit autofix

In addition to the minimal and mid checks, require an emitted CI adapter that
runs Rig's read-only repository check and discover an existing `format` or
`lint:fix` package script. Record that fix command for an explicit user action;
checks, hooks, and CI never invoke it automatically.

`lint-format-ci-gate-and-explicit-fix` passes only while the CI check file and
the recorded fix binding remain present. Missing CI support or a missing fix
script is a named coverage gap. Formatting or lint failures remain failures;
verification never edits the evidence to make itself green.
