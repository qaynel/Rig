# product-security.secrets.encrypted-store — floor and mutation-floor slice

This slice bounds encrypted store to secrets.encrypted-store. It uses `encrypted-store-slice-floor` and checks secret_store (nonempty): secret store must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.secrets.encrypted-store.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Select an approved repository-owned command to verify that behavior.
