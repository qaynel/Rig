# testing.test-data.anonymization — property-floor slice

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Policy grade slice `anonymization-slice-property-floor`: List every sensitive field, such as emails and names. An unlisted field leaks, so enumerate them.
