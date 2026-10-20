# anonymization

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Owned scope: `test-data.anonymization`.

Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Input: `rig-services/testing.test-data.anonymization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Select an approved repository-owned command to verify that behavior.

minimal: sensitive fields — ["email","address"].

mid: replacement strategy — "irreversible-synthetic-values".

maximal: retain reidentification map — false.
