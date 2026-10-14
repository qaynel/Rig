# testing.unit.test-case-generation — mid

Mid adds repository context for test case generation; it does not widen ownership beyond unit.test-case-generation. The context signals are asserted_outcomes.

Tie acceptance to the existing repository's test case generation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in unit under their own verdicts.

Acceptance target: fixture:testing.unit.test-case-generation:repository-context. Given unit.test-case-generation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent unit concern; fail when the result infers local convention without an inspectable source.
