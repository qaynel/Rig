# testing.regression.suite-curation — behavior-oracle slice

Policy grade slice. This slice bounds suite curation to regression.suite-curation. It uses `suite-curation-slice-behavior-oracle` and checks retained_suites (nonempty): retained suites must name the concrete repository contract..

For suite curation, choose a repository example that satisfies retained_suites at the behavior-oracle floor, plus a failure where retained suites must name the concrete repository contract. is false. For suite curation, wire `behavior-oracle` to `rig-services/testing.regression.suite-curation.json` and keep its verdict on retained_suites; missing evidence is a named gap, with ceiling suite curation configuration validation only; declared policy does not prove running suite curation behavior. Choose a repository-owned check that observes suite curation from rig-services/testing.regression.suite-curation.json..

Service-specific evidence cues:
Offer: Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.
minimal: retained suites — ["critical regression"].
mid: retirement reasons — ["obsolete API removed"].
maximal: remove without behavior owner — false.
