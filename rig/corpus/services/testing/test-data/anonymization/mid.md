# testing.test-data.anonymization — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for anonymization; it does not widen ownership beyond test-data.anonymization. For anonymization, inspect these context signals: replacement_strategy. Binding checks: anonymization-test-data-context.

Ground the decision in the existing repository's anonymization convention, then name the source path or command that establishes it. For anonymization, inspect the repository's actual spec, source, test, or configuration for replacement_strategy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring test-data services outside the anonymization decision for test-data.anonymization.

Acceptance target: fixture:testing.test-data.anonymization:repository-context. Given test-data.anonymization has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent test data concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.
minimal: sensitive fields — ["email","address"].
mid: replacement strategy — "irreversible-synthetic-values".
maximal: retain reidentification map — false.
