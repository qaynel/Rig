# testing.test-data.anonymization — property-floor slice

Policy grade slice. This slice bounds anonymization to test-data.anonymization. It uses `anonymization-slice-property-floor` and checks sensitive_fields (nonempty): sensitive fields must name the concrete repository contract..

For anonymization, choose a repository example that satisfies sensitive_fields at the property-floor floor, plus a failure where sensitive fields must name the concrete repository contract. is false. For anonymization, wire `property-floor` to `rig-services/testing.test-data.anonymization.json` and keep its verdict on sensitive_fields; missing evidence is a named gap, with ceiling anonymization configuration validation only; declared policy does not prove running anonymization behavior. Choose a repository-owned check that observes anonymization from rig-services/testing.test-data.anonymization.json..

Service-specific evidence cues:
Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.
minimal: sensitive fields — ["email","address"].
mid: replacement strategy — "irreversible-synthetic-values".
maximal: retain reidentification map — false.
