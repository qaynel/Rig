# testing.test-data.anonymization — behavior-oracle slice

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Policy grade slice `anonymization-slice-behavior-oracle`: List every sensitive field, such as emails and names. An unlisted field leaks, so enumerate them. Despite its name this slice is not a behavior oracle: it confirms sensitive fields, a replacement strategy and the re-identification-map flag are declared; it does not read any data.
