# infrastructure.networking.vpc-firewall — mid

Mid adds repository context for vpc firewall; it does not widen ownership beyond networking.vpc-firewall. The context signals are default_action.

Tie acceptance to the existing repository's vpc firewall convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in networking under their own verdicts.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:repository-context. Given networking.vpc-firewall has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent networking concern; fail when the result infers local convention without an inspectable source.
