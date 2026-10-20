# infrastructure.provisioning.iac-authoring — minimal

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for iac authoring. The minimal boundary for iac authoring checks resource_names (nonempty): resource names must name the concrete repository contract. Binding checks: iac-authoring-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe provisioning.iac-authoring; bind it to the input named in `rig-services/infrastructure.provisioning.iac-authoring.json` and preserve the check's failure status. When adopting this in an existing repository, connect iac authoring to the command that inspects resource_names and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside provisioning.iac-authoring as a failure.

Acceptance target: policy:infrastructure.provisioning.iac-authoring:minimal:iac-authoring-source-code-boundary.

Declared predicates: iac-authoring-source-code-boundary: `resource_names` is nonempty (a string or array).
