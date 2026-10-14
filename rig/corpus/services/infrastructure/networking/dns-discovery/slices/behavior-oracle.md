# infrastructure.networking.dns-discovery — behavior-oracle slice

This slice bounds dns discovery to networking.dns-discovery. It uses `dns-discovery-slice-behavior-oracle` and checks service_records (nonempty): service records must name the concrete repository contract..

Use a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.networking.dns-discovery.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Select an approved repository-owned command to verify that behavior.
