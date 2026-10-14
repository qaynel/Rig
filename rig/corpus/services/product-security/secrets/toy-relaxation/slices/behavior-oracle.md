# product-security.secrets.toy-relaxation — behavior-oracle slice

This slice bounds toy relaxation to secrets.toy-relaxation. It uses `toy-relaxation-slice-behavior-oracle` and checks toy_scope (nonempty): toy scope must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.secrets.toy-relaxation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.
