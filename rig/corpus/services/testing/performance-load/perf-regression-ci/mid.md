# testing.performance-load.perf-regression-ci — mid

Mid adds repository context for perf regression ci; it does not widen ownership beyond performance-load.perf-regression-ci. The context signals are regression_budget_percent.

Start from the existing repository's perf regression ci convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in performance-load under their own verdicts.

Acceptance target: fixture:testing.performance-load.perf-regression-ci:repository-context. Given performance-load.perf-regression-ci has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance load concern; fail when the result infers local convention without an inspectable source.
