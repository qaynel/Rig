# infrastructure.networking.vpc-firewall — mid

Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Policy grade remains unchanged at mid. `vpc-firewall-networking-context` checks `default_action` with the `nonempty` predicate. The check requires default_action to be present; the current good fixture chooses deny. It does not establish the effective default in a deployed VPC.

The value comes from `rig-services/infrastructure.networking.vpc-firewall.json`; this is configuration validation, not a claim that the repository follows a discovered convention. These checks inspect the declared firewall policy. They do not query a cloud provider, compute effective rules across network layers, or test packet reachability.
