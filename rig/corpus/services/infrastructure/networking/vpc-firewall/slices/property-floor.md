# infrastructure.networking.vpc-firewall — property-floor slice

Policy grade slice. This slice bounds vpc firewall to networking.vpc-firewall. It uses `vpc-firewall-slice-property-floor` and checks allowed_ingress (nonempty): allowed ingress must name the concrete repository contract..

For vpc firewall, choose a repository example that satisfies allowed_ingress at the property-floor floor, plus a failure where allowed ingress must name the concrete repository contract. is false. For vpc firewall, wire `property-floor` to `rig-services/infrastructure.networking.vpc-firewall.json` and keep its verdict on allowed_ingress; missing evidence is a named gap, with ceiling vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Choose a repository-owned check that observes vpc firewall from rig-services/infrastructure.networking.vpc-firewall.json..

Service-specific evidence cues:
Offer: Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.
minimal: allowed ingress — ["443/tcp"].
mid: default action — "deny".
maximal: allow world admin access — false.
