# testing.test-data.anonymization — minimal

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Policy grade, minimal: List every sensitive field, such as emails and names. An unlisted field leaks, so enumerate them. Binding checks: anonymization-source-code-boundary.

Acceptance target: policy:testing.test-data.anonymization:minimal:anonymization-source-code-boundary.
Declared predicates: anonymization-source-code-boundary: `sensitive_fields` is nonempty (a string or array).
