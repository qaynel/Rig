# testing.flaky-reliability.intermittent-rca — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for intermittent rca; it does not widen ownership beyond flaky-reliability.intermittent-rca. For intermittent rca, inspect these context signals: reproduction_attempts. Binding checks: intermittent-rca-flaky-reliability-context.

Inspect the existing repository's intermittent rca convention, then name the source path or command that establishes it. For intermittent rca, inspect the repository's actual spec, source, test, or configuration for reproduction_attempts; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring flaky-reliability services outside the intermittent rca decision for flaky-reliability.intermittent-rca.

Acceptance target: fixture:testing.flaky-reliability.intermittent-rca:repository-context. Given flaky-reliability.intermittent-rca has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent flaky reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.
minimal: observed conditions — ["parallel runs"].
mid: reproduction attempts — ["repeat with scheduler seed"].
maximal: blame randomness without evidence — false.
