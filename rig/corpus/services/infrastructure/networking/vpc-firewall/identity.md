# infrastructure.networking.vpc-firewall — identity

Policy grade: vpc firewall owns networking.vpc-firewall. Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Keep sibling services in networking under their own verdicts. Trace the verdict to the configured input at `rig-services/infrastructure.networking.vpc-firewall.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:policy-boundary. Given source-code is present and networking.vpc-firewall is selected, pass only when the repository binding evaluates networking.vpc-firewall and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern.

Service-specific evidence cues:
Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Owned scope: `networking.vpc-firewall`.

Offer: Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Input: `rig-services/infrastructure.networking.vpc-firewall.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed ingress — ["443/tcp"].

mid: default action — "deny".

maximal: allow world admin access — false.
