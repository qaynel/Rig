# infrastructure.provisioning.iac-authoring — minimal

Minimal establishes a non-vacuous policy boundary for iac authoring. It checks resource_names (nonempty): resource names must name the concrete repository contract..

Inspect a repository-owned command or existing native check that can observe provisioning.iac-authoring; bind it to the input named in `rig-services/infrastructure.provisioning.iac-authoring.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside provisioning.iac-authoring is a failure.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:policy-boundary. Given source-code is present and provisioning.iac-authoring is selected, pass only when the repository binding evaluates provisioning.iac-authoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. A passing policy check does not establish runtime behavior.
