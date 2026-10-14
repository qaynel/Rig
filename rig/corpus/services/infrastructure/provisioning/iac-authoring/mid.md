# infrastructure.provisioning.iac-authoring — mid

Mid adds repository context for iac authoring; it does not widen ownership beyond provisioning.iac-authoring. The context signals are state_backend.

Tie acceptance to the existing repository's iac authoring convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in provisioning under their own verdicts.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:repository-context. Given provisioning.iac-authoring has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent provisioning concern; fail when the result infers local convention without an inspectable source.
