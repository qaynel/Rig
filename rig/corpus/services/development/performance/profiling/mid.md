# development.performance.profiling — mid

Mid adds repository context for profiling; it does not widen ownership beyond code-profiling, bottleneck-identification. The context signals are measured_metrics.

Start from the existing repository's profiling convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in performance under their own verdicts.

Acceptance target: fixture:development.performance.profiling:repository-context. Given code-profiling has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance concern; fail when the result infers local convention without an inspectable source.
