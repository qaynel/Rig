# testing.mutation.survivor-rca — minimal

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Grade: minimal. Assurance remains Policy grade.

Name the surviving mutation so the investigation has a concrete starting point.

Input: `rig-services/testing.mutation.survivor-rca.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms surviving mutants, missing assertions and the equivalence-question flag are declared; it does not examine survivors.

Acceptance target: policy:testing.mutation.survivor-rca:minimal:survivor-rca-source-code-boundary.

Declared predicates: survivor-rca-source-code-boundary: `surviving_mutants` is nonempty (a string or array).

Check: `survivor-rca-source-code-boundary`.
