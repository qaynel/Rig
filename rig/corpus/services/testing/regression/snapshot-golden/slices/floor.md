# testing.regression.snapshot-golden — floor and mutation-floor slice

Policy grade slice. This slice bounds snapshot golden to regression.snapshot-golden. It uses `snapshot-golden-slice-floor` and checks golden_paths (nonempty): golden paths must name the concrete repository contract..

For snapshot golden, choose a repository example that satisfies golden_paths at the floor and mutation-floor floor, plus a failure where golden paths must name the concrete repository contract. is false. For snapshot golden, wire `floor and mutation-floor` to `rig-services/testing.regression.snapshot-golden.json` and keep its verdict on golden_paths; missing evidence is a named gap, with ceiling snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Choose a repository-owned check that observes snapshot golden from rig-services/testing.regression.snapshot-golden.json..

Service-specific evidence cues:
Offer: Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.
minimal: golden paths — ["fixtures/order.json"].
mid: reviewed diffs — ["field addition"].
maximal: automatic snapshot acceptance — false.
