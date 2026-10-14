# product-security.red-team.dast — behavior-oracle slice

Policy grade slice. This slice bounds dast to red-team.dast. It uses `dast-slice-behavior-oracle` and checks target_origin (nonempty): target origin must name the concrete repository contract..

For dast, choose a repository example that satisfies target_origin at the behavior-oracle floor, plus a failure where target origin must name the concrete repository contract. is false. For dast, wire `behavior-oracle` to `rig-services/product-security.red-team.dast.json` and keep its verdict on target_origin; missing evidence is a named gap, with ceiling dast configuration validation only; declared policy does not prove running dast behavior. Choose a repository-owned check that observes dast from rig-services/product-security.red-team.dast.json..

Service-specific evidence cues:
Offer: Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.
minimal: target origin — "http://127.0.0.1:8080".
mid: authorized scope — ["/api"].
maximal: scan unapproved targets — false.
