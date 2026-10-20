# testing.test-data.anonymization — mid

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: anonymization-source-code-boundary, anonymization-test-data-context.

Ground the decision in the existing repository's anonymization convention, then name the source path or command that establishes it. For anonymization, inspect the repository's actual spec, source, test, or configuration for replacement_strategy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring test-data services outside the anonymization decision for test-data.anonymization.

Acceptance target: policy:testing.test-data.anonymization:mid:anonymization-source-code-boundary+anonymization-test-data-context.

Declared predicates: anonymization-source-code-boundary: `sensitive_fields` is nonempty (a string or array); anonymization-test-data-context: `replacement_strategy` is nonempty (a string or array).
