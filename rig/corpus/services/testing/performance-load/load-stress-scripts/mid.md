# testing.performance-load.load-stress-scripts — mid

Mid adds repository context for load stress scripts; it does not widen ownership beyond perf-load-test-authoring, load-stress-scripts. The context signals are stop_conditions.

Use the existing repository's load stress scripts convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in performance-load under their own verdicts.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:repository-context. Given perf-load-test-authoring has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance load concern; fail when the result infers local convention without an inspectable source.
