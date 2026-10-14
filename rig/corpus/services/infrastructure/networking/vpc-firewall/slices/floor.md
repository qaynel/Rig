# infrastructure.networking.vpc-firewall — floor and mutation-floor slice

This slice bounds vpc firewall to networking.vpc-firewall. It uses `vpc-firewall-slice-floor` and checks allowed_ingress (nonempty): allowed ingress must name the concrete repository contract..

Start from a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.networking.vpc-firewall.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Select an approved repository-owned command to verify that behavior.
