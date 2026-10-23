# VPC firewall

Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Allow only required network ingress, default unmatched traffic to deny, and keep administrative access off the public internet.

Owned scope: `vpc-firewall`.

Read the declared input at `rig-services/infrastructure.networking.vpc-firewall.json`; retain its path in diagnostics when the file is malformed so the user can repair the right configuration.

Policy checks: allowed ingress rules is evaluated at minimal grade; `default_action` is evaluated at mid; and `allow_world_admin_access` is evaluated at maximal.

Coverage ceiling: These checks inspect the declared firewall policy. They do not query a cloud provider, compute effective rules across network layers, or test packet reachability.

List only required ports and protocols in allowed_ingress, choose a deny default, and leave allow_world_admin_access false. The config validator cannot see provider state or effective network reachability; those need a separate approved check.
