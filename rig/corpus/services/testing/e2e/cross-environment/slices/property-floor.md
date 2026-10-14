# testing.e2e.cross-environment — property-floor slice

Policy grade slice. This slice bounds cross environment to e2e.cross-environment. It uses `cross-environment-slice-property-floor` and checks environments (nonempty): environments must name the concrete repository contract..

For cross environment, choose a repository example that satisfies environments at the property-floor floor, plus a failure where environments must name the concrete repository contract. is false. For cross environment, wire `property-floor` to `rig-services/testing.e2e.cross-environment.json` and keep its verdict on environments; missing evidence is a named gap, with ceiling cross environment configuration validation only; declared policy does not prove running cross environment behavior. Choose a repository-owned check that observes cross environment from rig-services/testing.e2e.cross-environment.json..

Service-specific evidence cues:
Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.
minimal: environments — ["linux","macos"].
mid: shared cases — ["install and run"].
maximal: assume platform equivalence — false.
