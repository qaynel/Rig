# testing.test-data.anonymization — minimal

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for anonymization. The minimal boundary for anonymization checks sensitive_fields (nonempty): sensitive fields must name the concrete repository contract. Binding checks: anonymization-source-code-boundary.

Read a repository-owned command or existing native check that can observe test-data.anonymization; bind it to the input named in `rig-services/testing.test-data.anonymization.json` and preserve the check's failure status. When adopting this in an existing repository, connect anonymization to the command that inspects sensitive_fields and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside test-data.anonymization as a failure.

Acceptance target: policy:testing.test-data.anonymization:minimal:anonymization-source-code-boundary.

Declared predicates: anonymization-source-code-boundary: `sensitive_fields` is nonempty (a string or array).
