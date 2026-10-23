# infrastructure.networking.vpc-firewall — behavior-oracle slice

Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Policy grade slice for vpc firewall. `vpc-firewall-slice-behavior-oracle` applies the nonempty allowed_ingress predicate to the declared JSON input. Despite the slice name, this check is not a packet-flow oracle. It checks only that allowed_ingress contains a declared rule.

This slice does not observe runtime behavior; its result is limited to the configuration field at `rig-services/infrastructure.networking.vpc-firewall.json`. These checks inspect the declared firewall policy. They do not query a cloud provider, compute effective rules across network layers, or test packet reachability.
