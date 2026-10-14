# development.debugging.root-cause-analysis — mid

Mid adds repository context for root cause analysis; it does not widen ownership beyond debugging.root-cause-analysis. The context signals are causal_evidence.

Tie acceptance to the existing repository's root cause analysis convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in debugging under their own verdicts.

Acceptance target: fixture:development.debugging.root-cause-analysis:repository-context. Given debugging.root-cause-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent debugging concern; fail when the result infers local convention without an inspectable source.
