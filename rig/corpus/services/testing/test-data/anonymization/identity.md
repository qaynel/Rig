# testing.test-data.anonymization — identity

Policy grade: anonymization owns test-data.anonymization. Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Keep sibling services in test-data under their own verdicts. Inspect the configured input at `rig-services/testing.test-data.anonymization.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.test-data.anonymization:policy-boundary. Given source-code is present and test-data.anonymization is selected, pass only when the repository binding evaluates test-data.anonymization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern.

Service-specific evidence cues:
Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Owned scope: `test-data.anonymization`.

Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Input: `rig-services/testing.test-data.anonymization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Select an approved repository-owned command to verify that behavior.

minimal: sensitive fields — ["email","address"].

mid: replacement strategy — "irreversible-synthetic-values".

maximal: retain reidentification map — false.
