# infrastructure.provisioning.iac-authoring — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for iac authoring; it does not widen ownership beyond provisioning.iac-authoring. For iac authoring, inspect these context signals: state_backend. Binding checks: iac-authoring-provisioning-context.

Tie acceptance to the existing repository's iac authoring convention, then name the source path or command that establishes it. For iac authoring, inspect the repository's actual spec, source, test, or configuration for state_backend; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring provisioning services outside the iac authoring decision for provisioning.iac-authoring.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:repository-context. Given provisioning.iac-authoring has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent provisioning concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.
minimal: resource names — ["app-network"].
mid: state backend — "encrypted-remote".
maximal: apply without reviewed plan — false.
