# testing.test-data.anonymization — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for anonymization. The minimal boundary for anonymization checks sensitive_fields (nonempty): sensitive fields must name the concrete repository contract.. Binding checks: anonymization-source-code-boundary.

Read a repository-owned command or existing native check that can observe test-data.anonymization; bind it to the input named in `rig-services/testing.test-data.anonymization.json` and preserve the check's failure status. When adopting this in an existing repository, connect anonymization to the command that inspects sensitive_fields and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside test-data.anonymization as a failure.

Acceptance target: fixture:testing.test-data.anonymization:policy-boundary. Given source-code is present and test-data.anonymization is selected, pass only when the repository binding evaluates test-data.anonymization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. The ceiling is anonymization configuration validation only; declared policy does not prove running anonymization behavior. Choose a repository-owned check that observes anonymization from rig-services/testing.test-data.anonymization.json..

Service-specific evidence cues:
Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.
minimal: sensitive fields — ["email","address"].
mid: replacement strategy — "irreversible-synthetic-values".
maximal: retain reidentification map — false.
