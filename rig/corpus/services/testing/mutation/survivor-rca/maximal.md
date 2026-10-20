# testing.mutation.survivor-rca — maximal

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: survivor-rca-source-code-boundary, survivor-rca-mutation-context, survivor-rca-evidence-receipt.

Keep `ignore_equivalence_question` equal to false. Keep the equivalence question visible; the configured triage fields do not establish that a root cause was found.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.survivor-rca:maximal:survivor-rca-source-code-boundary+survivor-rca-mutation-context+survivor-rca-evidence-receipt.

Check: `survivor-rca-evidence-receipt`.
