# testing.test-data.anonymization — identity

Policy grade: anonymization owns test-data.anonymization. Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Input: `rig-services/testing.test-data.anonymization.json`. Configuration validation only, so it confirms sensitive fields, a replacement strategy and the re-identification-map flag are declared; it does not read any data.

Disposition: executable.
Acceptance target: policy:testing.test-data.anonymization:minimal:anonymization-source-code-boundary.
Declared predicates: anonymization-source-code-boundary: `sensitive_fields` is nonempty (a string or array).
