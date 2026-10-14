# development.debugging.structured-debugging — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for structured debugging; it does not widen ownership beyond debugging.structured-debugging. For structured debugging, inspect these context signals: ranked_hypotheses. Binding checks: structured-debugging-debugging-context.

Inspect the existing repository's structured debugging convention, then name the source path or command that establishes it. For structured debugging, inspect the repository's actual spec, source, test, or configuration for ranked_hypotheses; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring debugging services outside the structured debugging decision for debugging.structured-debugging.

Acceptance target: fixture:development.debugging.structured-debugging:repository-context. Given debugging.structured-debugging has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent debugging concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.
minimal: reproduction steps — ["run failing case"].
mid: ranked hypotheses — ["invalid input reaches parser"].
maximal: change before reproduction — false.
