# testing.test-data.anonymization — behavior-oracle slice

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Policy grade slice. This slice bounds anonymization to test-data.anonymization. It uses `anonymization-slice-behavior-oracle` and checks sensitive_fields (nonempty): sensitive fields must name the concrete repository contract.