# testing.test-data.anonymization — mid

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Policy grade, mid: Declare the replacement strategy, which must be irreversible while preserving data shape. Reversible masking is not anonymization, so name the method. Cumulative with minimal. Binding checks: anonymization-source-code-boundary, anonymization-test-data-context.

Acceptance target: policy:testing.test-data.anonymization:mid:anonymization-source-code-boundary+anonymization-test-data-context.
Declared predicates: anonymization-source-code-boundary: `sensitive_fields` is nonempty (a string or array); anonymization-test-data-context: `replacement_strategy` is nonempty (a string or array).
