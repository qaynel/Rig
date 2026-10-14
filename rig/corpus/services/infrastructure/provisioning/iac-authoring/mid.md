# infrastructure.provisioning.iac-authoring — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for iac authoring; it does not widen ownership beyond provisioning.iac-authoring. The context signals are state_backend. Binding checks: iac-authoring-provisioning-context.

Tie acceptance to the existing repository's iac authoring convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in provisioning under their own verdicts.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:repository-context. Given provisioning.iac-authoring has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent provisioning concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Owned scope: `provisioning.iac-authoring`.

Offer: Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Input: `rig-services/infrastructure.provisioning.iac-authoring.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource names — ["app-network"].

mid: state backend — "encrypted-remote".

maximal: apply without reviewed plan — false.
