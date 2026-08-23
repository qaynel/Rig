# Minimal — formatter cleanliness

Discover the repository's `format:check` package script and run it without a
shell for diff and whole-repository checks. Success means the configured
formatter reports no required rewrite and exits zero; the check itself must not
change source files.

If the script is absent or `package.json` is malformed, report
`lint-format-formatter-clean` as a coverage gap with the missing configuration
named. Do not install a formatter or substitute a generic success command.
