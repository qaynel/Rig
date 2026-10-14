# infrastructure.scaling-reliability.chaos-engineering — property-floor slice

Policy grade slice. This slice bounds chaos engineering to scaling-reliability.chaos-engineering. It uses `chaos-engineering-slice-property-floor` and checks fault_scenarios (nonempty): fault scenarios must name the concrete repository contract..

For chaos engineering, choose a repository example that satisfies fault_scenarios at the property-floor floor, plus a failure where fault scenarios must name the concrete repository contract. is false. For chaos engineering, wire `property-floor` to `rig-services/infrastructure.scaling-reliability.chaos-engineering.json` and keep its verdict on fault_scenarios; missing evidence is a named gap, with ceiling chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Choose a repository-owned check that observes chaos engineering from rig-services/infrastructure.scaling-reliability.chaos-engineering.json..

Service-specific evidence cues:
Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.
minimal: fault scenarios — ["worker unavailable"].
mid: stop conditions — ["error budget exhausted"].
maximal: production experiment without approval — false.
