# testing.test-data.anonymization — minimal

Minimal establishes a non-vacuous policy boundary for anonymization. It checks sensitive_fields (nonempty): sensitive fields must name the concrete repository contract..

Read a repository-owned command or existing native check that can observe test-data.anonymization; bind it to the input named in `rig-services/testing.test-data.anonymization.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside test-data.anonymization is a failure.

Acceptance target: fixture:testing.test-data.anonymization:policy-boundary. Given source-code is present and test-data.anonymization is selected, pass only when the repository binding evaluates test-data.anonymization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. A passing policy check does not establish runtime behavior.
