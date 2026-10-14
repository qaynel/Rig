# testing.test-data.anonymization — floor and mutation-floor slice

This slice bounds anonymization to test-data.anonymization. It uses `anonymization-slice-floor` and checks sensitive_fields (nonempty): sensitive fields must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.test-data.anonymization.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than anonymization configuration validation only; declared policy does not prove running anonymization behavior. Select an approved repository-owned command to verify that behavior.
