# Behavior-oracle formatting slice

Require formatter cleanliness for executable examples and assertion code used
as behavior oracles. The slice keeps oracle diffs readable without importing
the selected service's linter, CI gate, or autofix policy.

Failure is the real repository formatter's nonzero result; an unavailable
`format:check` command is a coverage gap, never a vacuous success.
