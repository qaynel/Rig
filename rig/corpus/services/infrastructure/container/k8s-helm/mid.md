# infrastructure.container.k8s-helm — mid

Mid adds repository context for k8s helm; it does not widen ownership beyond container.k8s-helm. The context signals are readiness_probe.

Inspect the existing repository's k8s helm convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in container under their own verdicts.

Acceptance target: fixture:infrastructure.container.k8s-helm:repository-context. Given container.k8s-helm has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent container concern; fail when the result infers local convention without an inspectable source.
