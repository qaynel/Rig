# testing.mutation.survivor-rca — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for survivor rca. The minimal boundary for survivor rca checks surviving_mutants (nonempty): surviving mutants must name the concrete repository contract.. Binding checks: survivor-rca-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe mutation.survivor-rca; bind it to the input named in `rig-services/testing.mutation.survivor-rca.json` and preserve the check's failure status. When adopting this in an existing repository, connect survivor rca to the command that inspects surviving_mutants and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside mutation.survivor-rca as a failure.

Acceptance target: fixture:testing.mutation.survivor-rca:policy-boundary. Given source-code is present and mutation.survivor-rca is selected, pass only when the repository binding evaluates mutation.survivor-rca and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. The ceiling is survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Choose a repository-owned check that observes survivor rca from rig-services/testing.mutation.survivor-rca.json..

Service-specific evidence cues:
Offer: Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.
minimal: surviving mutants — ["boundary comparison changed"].
mid: missing assertions — ["exact limit rejected"].
maximal: ignore equivalence question — false.
