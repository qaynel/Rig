# development.code-creation.refactoring — behavior-oracle slice

This slice bounds refactoring to code-creation.refactoring. It uses `refactoring-slice-behavior-oracle` and checks preserved_behaviors (nonempty): preserved behaviors must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-creation.refactoring.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than refactoring configuration validation only; declared policy does not prove running refactoring behavior. Select an approved repository-owned command to verify that behavior.
