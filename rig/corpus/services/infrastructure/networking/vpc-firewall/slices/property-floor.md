# infrastructure.networking.vpc-firewall — property-floor slice

Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Policy grade slice for vpc firewall. `vpc-firewall-slice-property-floor` requires allowed ingress rules to be nonempty. The property floor checks presence of an ingress rule; it does not prove least privilege, rule ordering, or effective cloud policy.

No runtime property is measured by this predicate. Input: `rig-services/infrastructure.networking.vpc-firewall.json`. These checks inspect the declared firewall policy. They do not query a cloud provider, compute effective rules across network layers, or test packet reachability.
