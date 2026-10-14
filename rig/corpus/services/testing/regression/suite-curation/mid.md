# testing.regression.suite-curation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for suite curation; it does not widen ownership beyond regression.suite-curation. For suite curation, inspect these context signals: retirement_reasons. Binding checks: suite-curation-regression-context.

Start from the existing repository's suite curation convention, then name the source path or command that establishes it. For suite curation, inspect the repository's actual spec, source, test, or configuration for retirement_reasons; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring regression services outside the suite curation decision for regression.suite-curation.

Acceptance target: fixture:testing.regression.suite-curation:repository-context. Given regression.suite-curation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent regression concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.
minimal: retained suites — ["critical regression"].
mid: retirement reasons — ["obsolete API removed"].
maximal: remove without behavior owner — false.
