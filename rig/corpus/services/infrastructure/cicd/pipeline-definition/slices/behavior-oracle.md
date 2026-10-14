# infrastructure.cicd.pipeline-definition — behavior-oracle slice

This slice bounds pipeline definition to cicd.pipeline-definition. It uses `pipeline-definition-slice-behavior-oracle` and checks stages (nonempty): stages must name the concrete repository contract..

Start from a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.cicd.pipeline-definition.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior.
