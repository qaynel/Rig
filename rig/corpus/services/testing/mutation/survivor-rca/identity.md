# testing.mutation.survivor-rca — identity

Policy grade: survivor rca owns mutation.survivor-rca. Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Keep neighboring mutation services outside the survivor rca decision for mutation.survivor-rca. Use the configured input at `rig-services/testing.mutation.survivor-rca.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Choose a repository-owned check that observes survivor rca from rig-services/testing.mutation.survivor-rca.json.

Acceptance target: fixture:testing.mutation.survivor-rca:policy-boundary. Given source-code is present and mutation.survivor-rca is selected, pass only when the repository binding evaluates mutation.survivor-rca and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.

Service-specific evidence cues:
Offer: Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.
minimal: surviving mutants — ["boundary comparison changed"].
mid: missing assertions — ["exact limit rejected"].
maximal: ignore equivalence question — false.
