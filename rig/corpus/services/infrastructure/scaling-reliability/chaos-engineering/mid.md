# infrastructure.scaling-reliability.chaos-engineering — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for chaos engineering; it does not widen ownership beyond scaling-reliability.chaos-engineering. For chaos engineering, inspect these context signals: stop_conditions. Binding checks: chaos-engineering-scaling-reliability-context.

Inspect the existing repository's chaos engineering convention, then name the source path or command that establishes it. For chaos engineering, inspect the repository's actual spec, source, test, or configuration for stop_conditions; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring scaling-reliability services outside the chaos engineering decision for scaling-reliability.chaos-engineering.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:repository-context. Given scaling-reliability.chaos-engineering has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent scaling reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.
minimal: fault scenarios — ["worker unavailable"].
mid: stop conditions — ["error budget exhausted"].
maximal: production experiment without approval — false.
