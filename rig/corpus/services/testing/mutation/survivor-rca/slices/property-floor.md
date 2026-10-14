# testing.mutation.survivor-rca — property-floor slice

Policy grade slice. This slice bounds survivor rca to mutation.survivor-rca. It uses `survivor-rca-slice-property-floor` and checks surviving_mutants (nonempty): surviving mutants must name the concrete repository contract..

For survivor rca, choose a repository example that satisfies surviving_mutants at the property-floor floor, plus a failure where surviving mutants must name the concrete repository contract. is false. For survivor rca, wire `property-floor` to `rig-services/testing.mutation.survivor-rca.json` and keep its verdict on surviving_mutants; missing evidence is a named gap, with ceiling survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Choose a repository-owned check that observes survivor rca from rig-services/testing.mutation.survivor-rca.json..

Service-specific evidence cues:
Offer: Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.
minimal: surviving mutants — ["boundary comparison changed"].
mid: missing assertions — ["exact limit rejected"].
maximal: ignore equivalence question — false.
