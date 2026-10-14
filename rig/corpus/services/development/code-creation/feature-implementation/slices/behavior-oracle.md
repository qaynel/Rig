# development.code-creation.feature-implementation — behavior-oracle slice

This slice bounds feature implementation to code-creation.feature-implementation. It uses `feature-implementation-slice-behavior-oracle` and checks acceptance_cases (nonempty): acceptance cases must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-creation.feature-implementation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Select an approved repository-owned command to verify that behavior.
