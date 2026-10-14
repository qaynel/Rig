# testing.integration.cross-module — property-floor slice

Policy grade slice. This slice bounds cross module to integration.cross-module. It uses `cross-module-slice-property-floor` and checks participating_modules (nonempty): participating modules must name the concrete repository contract..

For cross module, choose a repository example that satisfies participating_modules at the property-floor floor, plus a failure where participating modules must name the concrete repository contract. is false. For cross module, wire `property-floor` to `rig-services/testing.integration.cross-module.json` and keep its verdict on participating_modules; missing evidence is a named gap, with ceiling cross module configuration validation only; declared policy does not prove running cross module behavior. Choose a repository-owned check that observes cross module from rig-services/testing.integration.cross-module.json..

Service-specific evidence cues:
Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.
minimal: participating modules — ["orders","inventory"].
mid: interaction cases — ["order reserves stock"].
maximal: stub internal contracts — false.
