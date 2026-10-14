# testing.mutation.survivor-rca — behavior-oracle slice

This slice bounds survivor rca to mutation.survivor-rca. It uses `survivor-rca-slice-behavior-oracle` and checks surviving_mutants (nonempty): surviving mutants must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.survivor-rca.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Select an approved repository-owned command to verify that behavior.
