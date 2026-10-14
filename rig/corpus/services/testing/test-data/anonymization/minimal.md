# testing.test-data.anonymization — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for anonymization. It checks sensitive_fields (nonempty): sensitive fields must name the concrete repository contract.. Binding checks: anonymization-source-code-boundary.

Read a repository-owned command or existing native check that can observe test-data.anonymization; bind it to the input named in `rig-services/testing.test-data.anonymization.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside test-data.anonymization is a failure.

Acceptance target: fixture:testing.test-data.anonymization:policy-boundary. Given source-code is present and test-data.anonymization is selected, pass only when the repository binding evaluates test-data.anonymization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Owned scope: `test-data.anonymization`.

Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Input: `rig-services/testing.test-data.anonymization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Select an approved repository-owned command to verify that behavior.

minimal: sensitive fields — ["email","address"].

mid: replacement strategy — "irreversible-synthetic-values".

maximal: retain reidentification map — false.
