# infrastructure.cicd.release-gating — mid

Mid adds repository context for release gating; it does not widen ownership beyond cicd.release-gating. The context signals are release_revision.

Anchor the review on the existing repository's release gating convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cicd under their own verdicts.

Acceptance target: fixture:infrastructure.cicd.release-gating:repository-context. Given cicd.release-gating has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cicd concern; fail when the result infers local convention without an inspectable source.
