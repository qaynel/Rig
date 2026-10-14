# infrastructure.networking.vpc-firewall — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for vpc firewall. The evidence must preserve the allowed_ingress, default_action, allow_world_admin_access inputs that determined the result. Binding checks: vpc-firewall-evidence-receipt.

Read a second run against unchanged vpc firewall inputs. Record the allowed_ingress, default_action, allow_world_admin_access inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this vpc firewall result is stale. The ceiling remains: vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Choose a repository-owned check that observes vpc firewall from rig-services/infrastructure.networking.vpc-firewall.json.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:evidence-replay. Given the networking.vpc-firewall binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.
minimal: allowed ingress — ["443/tcp"].
mid: default action — "deny".
maximal: allow world admin access — false.
