# testing.property-fuzz.invariant-identification — floor and mutation-floor slice

This slice bounds invariant identification to property-fuzz.invariant-identification. It uses `invariant-identification-slice-floor` and checks invariants (nonempty): invariants must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.property-fuzz.invariant-identification.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than invariant identification configuration validation only; declared policy does not prove running invariant identification behavior. Select an approved repository-owned command to verify that behavior.
