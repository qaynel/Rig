# development.architecture.design-review — mid

Mid adds repository context for design review; it does not widen ownership beyond architecture.design-review. The context signals are tradeoffs.

Anchor the review on the existing repository's design review convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in architecture under their own verdicts.

Acceptance target: fixture:development.architecture.design-review:repository-context. Given architecture.design-review has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent architecture concern; fail when the result infers local convention without an inspectable source.
