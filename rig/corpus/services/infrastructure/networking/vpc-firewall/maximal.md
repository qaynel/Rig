# infrastructure.networking.vpc-firewall — maximal

Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Maximal still provides Policy grade assurance. `vpc-firewall-evidence-receipt` checks `allow_world_admin_access`: administrative ingress must not be open to the world. The checks reject world-open administrative access but do not collect, sign, or replay provider evidence.

The installed predicate does not produce a replayable evidence receipt. It checks the JSON at `rig-services/infrastructure.networking.vpc-firewall.json` only. These checks inspect the declared firewall policy. They do not query a cloud provider, compute effective rules across network layers, or test packet reachability.
