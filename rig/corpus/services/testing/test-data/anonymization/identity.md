# testing.test-data.anonymization — identity

Policy grade: anonymization owns test-data.anonymization. Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Keep neighboring test-data services outside the anonymization decision for test-data.anonymization. Inspect the configured input at `rig-services/testing.test-data.anonymization.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Choose a repository-owned check that observes anonymization from rig-services/testing.test-data.anonymization.json.

Acceptance target: fixture:testing.test-data.anonymization:policy-boundary. Given source-code is present and test-data.anonymization is selected, pass only when the repository binding evaluates test-data.anonymization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern.

Service-specific evidence cues:
Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.
minimal: sensitive fields — ["email","address"].
mid: replacement strategy — "irreversible-synthetic-values".
maximal: retain reidentification map — false.
