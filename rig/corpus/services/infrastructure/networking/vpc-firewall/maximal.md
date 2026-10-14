# infrastructure.networking.vpc-firewall — maximal

Maximal adds a replayable evidence receipt for vpc firewall. The evidence must preserve the allowed_ingress, default_action, allow_world_admin_access inputs that determined the result.

Read a second run against unchanged vpc firewall inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:evidence-replay. Given the networking.vpc-firewall binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
