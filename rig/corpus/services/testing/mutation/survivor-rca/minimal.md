# testing.mutation.survivor-rca — minimal

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no surviving_mutants: the bad fixture has `surviving_mutants` = `[]`, while the accepted fixture has `surviving_mutants` = `["boundary comparison changed"]`.

List at least one value for `surviving_mutants`. The result says only that the configured operator or input is present. Name the surviving mutation so the investigation has a concrete starting point.

Input: `rig-services/testing.mutation.survivor-rca.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.survivor-rca:minimal:survivor-rca-source-code-boundary.

Declared predicates: survivor-rca-source-code-boundary: `surviving_mutants` is nonempty (a string or array).

Check: `survivor-rca-source-code-boundary`.
