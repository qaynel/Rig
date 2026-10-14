# testing.property-fuzz.invariant-identification — floor and mutation-floor slice

Policy grade slice. This slice bounds invariant identification to property-fuzz.invariant-identification. It uses `invariant-identification-slice-floor` and checks invariants (nonempty): invariants must name the concrete repository contract..

For invariant identification, choose a repository example that satisfies invariants at the floor and mutation-floor floor, plus a failure where invariants must name the concrete repository contract. is false. For invariant identification, wire `floor and mutation-floor` to `rig-services/testing.property-fuzz.invariant-identification.json` and keep its verdict on invariants; missing evidence is a named gap, with ceiling invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Choose a repository-owned check that observes invariant identification from rig-services/testing.property-fuzz.invariant-identification.json..

Service-specific evidence cues:
Offer: State invariants independently of the function being tested and bound the generated input domain. Computing the expectation with the same implementation hides shared defects.
minimal: invariants — ["sum of debits equals credits"].
mid: input domain — "nonnegative integer amounts".
maximal: derive expected from subject — false.
