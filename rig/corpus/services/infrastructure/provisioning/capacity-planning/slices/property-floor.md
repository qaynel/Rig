# infrastructure.provisioning.capacity-planning — property-floor slice

Policy grade slice. This slice bounds capacity planning to provisioning.capacity-planning. It uses `capacity-planning-slice-property-floor` and checks peak_requests_per_second (minimum 100): peak requests per second must meet the configured minimum of 100..

For capacity planning, choose a repository example that satisfies peak_requests_per_second at the property-floor floor, plus a failure where peak requests per second must meet the configured minimum of 100. is false. For capacity planning, wire `property-floor` to `rig-services/infrastructure.provisioning.capacity-planning.json` and keep its verdict on peak_requests_per_second; missing evidence is a named gap, with ceiling capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Choose a repository-owned check that observes capacity planning from rig-services/infrastructure.provisioning.capacity-planning.json..

Service-specific evidence cues:
Offer: Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.
minimal: peak requests per second — 100.
mid: headroom percent — 30.
maximal: ignore growth forecast — false.
