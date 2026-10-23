# anonymization

Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Owned scope: `test-data.anonymization`. Input: `rig-services/testing.test-data.anonymization.json`.

Coverage ceiling: Configuration validation only, so it confirms sensitive fields, a replacement strategy and the re-identification-map flag are declared; it does not read any data.

minimal: sensitive fields — ["email","address"]. List every sensitive field, such as emails and names. An unlisted field leaks, so enumerate them.

mid: replacement strategy — "irreversible-synthetic-values". Declare the replacement strategy, which must be irreversible while preserving data shape. Reversible masking is not anonymization, so name the method.

maximal: retain reidentification map — false. Set retaining a re-identification map to false. A lookup from synthetic values to people defeats anonymization, so delete it.
