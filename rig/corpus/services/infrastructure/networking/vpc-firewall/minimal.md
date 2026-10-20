# infrastructure.networking.vpc-firewall — minimal

Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Policy grade remains the assurance level. `vpc-firewall-source-code-boundary` requires allowed ingress rules to be nonempty. The good fixture provides 443/tcp; the bad fixture uses an empty allowed_ingress list and should fail this predicate.

This is a JSON configuration check on `rig-services/infrastructure.networking.vpc-firewall.json`. A passing value does not prove a running vpc firewall service is reachable or functioning. These checks inspect the declared firewall policy. They do not query a cloud provider, compute effective rules across network layers, or test packet reachability.
