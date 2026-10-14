# infrastructure.container.service-mesh — mid

Mid adds repository context for service mesh; it does not widen ownership beyond container.service-mesh. The context signals are transport_security.

Start from the existing repository's service mesh convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in container under their own verdicts.

Acceptance target: fixture:infrastructure.container.service-mesh:repository-context. Given container.service-mesh has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent container concern; fail when the result infers local convention without an inspectable source.
