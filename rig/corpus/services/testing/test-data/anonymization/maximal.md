# testing.test-data.anonymization — maximal

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: anonymization-source-code-boundary, anonymization-test-data-context, anonymization-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.test-data.anonymization:maximal:anonymization-source-code-boundary+anonymization-test-data-context+anonymization-evidence-receipt.

Declared predicates: anonymization-source-code-boundary: `sensitive_fields` is nonempty (a string or array); anonymization-test-data-context: `replacement_strategy` is nonempty (a string or array); anonymization-evidence-receipt: `retain_reidentification_map` equals false.
