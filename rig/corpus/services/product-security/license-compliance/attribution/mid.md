# product-security.license-compliance.attribution — mid

Mid adds repository context for attribution; it does not widen ownership beyond license-compliance.attribution. The context signals are attributed_components.

Read the existing repository's attribution convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in license-compliance under their own verdicts.

Acceptance target: fixture:product-security.license-compliance.attribution:repository-context. Given license-compliance.attribution has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent license compliance concern; fail when the result infers local convention without an inspectable source.
