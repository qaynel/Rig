# testing.mutation.mutant-generator — behavior-oracle slice

This slice bounds mutant generator to mutation.mutant-generator. It uses `mutant-generator-slice-behavior-oracle` and checks mutation_operators (nonempty): mutation operators must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.mutant-generator.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.
