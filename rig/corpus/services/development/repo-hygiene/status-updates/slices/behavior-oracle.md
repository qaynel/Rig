# development.repo-hygiene.status-updates — behavior-oracle slice

Policy grade slice. This slice bounds status updates to repo-hygiene.status-updates. It uses `status-updates-slice-behavior-oracle` and checks completed (nonempty): completed must name the concrete repository contract..

For status updates, choose a repository example that satisfies completed at the behavior-oracle floor, plus a failure where completed must name the concrete repository contract. is false. For status updates, wire `behavior-oracle` to `rig-services/development.repo-hygiene.status-updates.json` and keep its verdict on completed; missing evidence is a named gap, with ceiling status updates configuration validation only; declared policy does not prove running status updates behavior. Choose a repository-owned check that observes status updates from rig-services/development.repo-hygiene.status-updates.json..

Service-specific evidence cues:
Offer: Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.
minimal: completed — ["parser regression reproduced"].
mid: in flight — ["shared boundary fix"].
maximal: next action — "run parser regression".
