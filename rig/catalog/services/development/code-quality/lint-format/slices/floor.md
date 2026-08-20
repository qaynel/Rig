# Formatter-only dependency floor

Provide only the read-only `lint-format-formatter-clean` check backed by the
repository's existing `format:check` command. This slice does not select a
lint-format grade, import the linter or CI policy, or authorize autofix.

`mutation-floor` deliberately aliases this fragment: mutation work needs the
same formatter-cleanliness floor so generated diffs are not obscured by
formatting noise, and no distinct mutation behavior belongs here.
