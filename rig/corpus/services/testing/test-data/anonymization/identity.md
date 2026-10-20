# testing.test-data.anonymization — identity

Policy grade: anonymization owns test-data.anonymization. Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Keep neighboring test-data services outside the anonymization decision for test-data.anonymization. Inspect the configured input at `rig-services/testing.test-data.anonymization.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Choose a repository-owned check that observes anonymization from rig-services/testing.test-data.anonymization.json.

Acceptance target: policy:testing.test-data.anonymization:minimal:anonymization-source-code-boundary.

Declared predicates: anonymization-source-code-boundary: `sensitive_fields` is nonempty (a string or array).
