# testing.test-data.anonymization — maximal

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Policy grade, maximal: Set retaining a re-identification map to false. A lookup from synthetic values to people defeats anonymization, so delete it. Cumulative with minimal and mid. Binding checks: anonymization-source-code-boundary, anonymization-test-data-context, anonymization-evidence-receipt.

Acceptance target: policy:testing.test-data.anonymization:maximal:anonymization-source-code-boundary+anonymization-test-data-context+anonymization-evidence-receipt.
Declared predicates: anonymization-source-code-boundary: `sensitive_fields` is nonempty (a string or array); anonymization-test-data-context: `replacement_strategy` is nonempty (a string or array); anonymization-evidence-receipt: `retain_reidentification_map` equals false.
