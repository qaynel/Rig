# infrastructure.provisioning.iac-authoring — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for iac authoring. It checks resource_names (nonempty): resource names must name the concrete repository contract.. Binding checks: iac-authoring-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe provisioning.iac-authoring; bind it to the input named in `rig-services/infrastructure.provisioning.iac-authoring.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside provisioning.iac-authoring is a failure.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:policy-boundary. Given source-code is present and provisioning.iac-authoring is selected, pass only when the repository binding evaluates provisioning.iac-authoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Owned scope: `provisioning.iac-authoring`.

Offer: Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Input: `rig-services/infrastructure.provisioning.iac-authoring.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource names — ["app-network"].

mid: state backend — "encrypted-remote".

maximal: apply without reviewed plan — false.
