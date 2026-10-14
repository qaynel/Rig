# infrastructure.provisioning.iac-authoring — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for iac authoring. The minimal boundary for iac authoring checks resource_names (nonempty): resource names must name the concrete repository contract.. Binding checks: iac-authoring-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe provisioning.iac-authoring; bind it to the input named in `rig-services/infrastructure.provisioning.iac-authoring.json` and preserve the check's failure status. When adopting this in an existing repository, connect iac authoring to the command that inspects resource_names and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside provisioning.iac-authoring as a failure.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:policy-boundary. Given source-code is present and provisioning.iac-authoring is selected, pass only when the repository binding evaluates provisioning.iac-authoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. The ceiling is iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Choose a repository-owned check that observes iac authoring from rig-services/infrastructure.provisioning.iac-authoring.json..

Service-specific evidence cues:
Offer: Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.
minimal: resource names — ["app-network"].
mid: state backend — "encrypted-remote".
maximal: apply without reviewed plan — false.
