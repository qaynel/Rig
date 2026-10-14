# testing.mutation.equivalent-mutant-detector — behavior-oracle slice

This slice bounds equivalent mutant detector to mutation.equivalent-mutant-detector. It uses `equivalent-mutant-detector-slice-behavior-oracle` and checks equivalence_evidence (nonempty): equivalence evidence must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.equivalent-mutant-detector.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.
