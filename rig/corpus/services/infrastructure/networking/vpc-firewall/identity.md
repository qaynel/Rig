# infrastructure.networking.vpc-firewall — identity

Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Policy grade: VPC firewall owns only `vpc-firewall`. Allow only required network ingress, default unmatched traffic to deny, and keep administrative access off the public internet.

The applicable surface is source-code with its declared input at `rig-services/infrastructure.networking.vpc-firewall.json`; discovery preserves that path even when the JSON is malformed. The installed check evaluates the fields below, not live vpc firewall behavior.

Disposition: executable configuration validation. Coverage ceiling: VPC firewall configuration validation only. These checks do not query a cloud provider, compute effective rules across network layers, or test packet reachability.

The good fixture at `tests/fixtures/services/infrastructure.networking.vpc-firewall/good/rig-services/infrastructure.networking.vpc-firewall.json` passes the declared predicates. The bad fixture at `tests/fixtures/services/infrastructure.networking.vpc-firewall/bad/rig-services/infrastructure.networking.vpc-firewall.json` demonstrates the allowed ingress rules boundary. No adjacent networking service is part of this decision.
