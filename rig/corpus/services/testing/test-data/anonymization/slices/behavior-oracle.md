# testing.test-data.anonymization — behavior-oracle slice

Policy grade slice. This slice bounds anonymization to test-data.anonymization. It uses `anonymization-slice-behavior-oracle` and checks sensitive_fields (nonempty): sensitive fields must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.test-data.anonymization.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than anonymization configuration validation only; declared policy does not prove running anonymization behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Owned scope: `test-data.anonymization`.

Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Input: `rig-services/testing.test-data.anonymization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Select an approved repository-owned command to verify that behavior.

minimal: sensitive fields — ["email","address"].

mid: replacement strategy — "irreversible-synthetic-values".

maximal: retain reidentification map — false.
