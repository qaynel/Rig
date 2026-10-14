# testing.regression.suite-curation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for suite curation; it does not widen ownership beyond regression.suite-curation. The context signals are retirement_reasons. Binding checks: suite-curation-regression-context.

Start from the existing repository's suite curation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in regression under their own verdicts.

Acceptance target: fixture:testing.regression.suite-curation:repository-context. Given regression.suite-curation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent regression concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Owned scope: `regression.suite-curation`.

Offer: Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Input: `rig-services/testing.regression.suite-curation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior.

minimal: retained suites — ["critical regression"].

mid: retirement reasons — ["obsolete API removed"].

maximal: remove without behavior owner — false.
