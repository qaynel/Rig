# infrastructure.container.image-optimization — mid

Mid adds repository context for image optimization; it does not widen ownership beyond container.image-optimization. The context signals are runtime_user.

Tie acceptance to the existing repository's image optimization convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in container under their own verdicts.

Acceptance target: fixture:infrastructure.container.image-optimization:repository-context. Given container.image-optimization has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent container concern; fail when the result infers local convention without an inspectable source.
