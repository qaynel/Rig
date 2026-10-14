# infrastructure.networking.vpc-firewall — behavior-oracle slice

Policy grade slice. This slice bounds vpc firewall to networking.vpc-firewall. It uses `vpc-firewall-slice-behavior-oracle` and checks allowed_ingress (nonempty): allowed ingress must name the concrete repository contract..

Use a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.networking.vpc-firewall.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Owned scope: `networking.vpc-firewall`.

Offer: Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Input: `rig-services/infrastructure.networking.vpc-firewall.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed ingress — ["443/tcp"].

mid: default action — "deny".

maximal: allow world admin access — false.
