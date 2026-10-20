# testing.test-data.anonymization — floor and mutation-floor slice

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Policy grade slice. This slice bounds anonymization to test-data.anonymization. It uses `anonymization-slice-floor` and checks sensitive_fields (nonempty): sensitive fields must name the concrete repository contract.