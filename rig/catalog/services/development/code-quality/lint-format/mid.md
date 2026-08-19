# Mid addition — linter cleanliness

In addition to the minimal formatter check, discover and run the repository's
`lint` package script for diff and whole-repository checks. Both commands must
exit zero, in formatter-then-linter order, and neither may be replaced by an
echo, unconditional exit, or absent-binding skip.

An absent linter is the nonzero `lint-format-linter-clean` coverage gap. The
formatter behavior from minimal remains active unchanged.
