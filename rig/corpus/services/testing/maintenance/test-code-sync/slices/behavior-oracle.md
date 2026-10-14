# testing.maintenance.test-code-sync — behavior-oracle slice

Policy grade slice. This slice bounds test code sync to maintenance.test-code-sync. It uses `test-code-sync-slice-behavior-oracle` and checks changed_behaviors (nonempty): changed behaviors must name the concrete repository contract..

For test code sync, choose a repository example that satisfies changed_behaviors at the behavior-oracle floor, plus a failure where changed behaviors must name the concrete repository contract. is false. For test code sync, wire `behavior-oracle` to `rig-services/testing.maintenance.test-code-sync.json` and keep its verdict on changed_behaviors; missing evidence is a named gap, with ceiling test code sync configuration validation only; declared policy does not prove running test code sync behavior. Choose a repository-owned check that observes test code sync from rig-services/testing.maintenance.test-code-sync.json..

Service-specific evidence cues:
Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.
minimal: changed behaviors — ["owner is required"].
mid: updated cases — ["reject missing owner"].
maximal: tests follow output blindly — false.
