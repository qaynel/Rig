# testing.flaky-reliability.intermittent-rca — property-floor slice

Policy grade slice. This slice bounds intermittent rca to flaky-reliability.intermittent-rca. It uses `intermittent-rca-slice-property-floor` and checks observed_conditions (nonempty): observed conditions must name the concrete repository contract..

For intermittent rca, choose a repository example that satisfies observed_conditions at the property-floor floor, plus a failure where observed conditions must name the concrete repository contract. is false. For intermittent rca, wire `property-floor` to `rig-services/testing.flaky-reliability.intermittent-rca.json` and keep its verdict on observed_conditions; missing evidence is a named gap, with ceiling intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Choose a repository-owned check that observes intermittent rca from rig-services/testing.flaky-reliability.intermittent-rca.json..

Service-specific evidence cues:
Offer: Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.
minimal: observed conditions — ["parallel runs"].
mid: reproduction attempts — ["repeat with scheduler seed"].
maximal: blame randomness without evidence — false.
