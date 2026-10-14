# infrastructure.provisioning.iac-authoring — identity

Policy grade: iac authoring owns provisioning.iac-authoring. Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Keep sibling services in provisioning under their own verdicts. Trace the verdict to the configured input at `rig-services/infrastructure.provisioning.iac-authoring.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:policy-boundary. Given source-code is present and provisioning.iac-authoring is selected, pass only when the repository binding evaluates provisioning.iac-authoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern.

Service-specific evidence cues:
Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Owned scope: `provisioning.iac-authoring`.

Offer: Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Input: `rig-services/infrastructure.provisioning.iac-authoring.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource names — ["app-network"].

mid: state backend — "encrypted-remote".

maximal: apply without reviewed plan — false.
