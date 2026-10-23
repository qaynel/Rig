# infrastructure.networking.vpc-firewall — floor and mutation-floor slice

Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Policy grade slice for vpc firewall. `vpc-firewall-slice-floor` applies the same declared-field predicate as the minimal grade: allowed ingress rules must be nonempty. The floor rejects an empty allowed_ingress list; the good fixture allows 443/tcp and the bad fixture removes all ingress rules.

The mutation-floor alias uses this same check ID and condition; it does not add a separate mutation test. These checks inspect the declared firewall policy. They do not query a cloud provider, compute effective rules across network layers, or test packet reachability.
