# testing.test-data.anonymization - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`anonymization-source-code-boundary` owns `test-data.anonymization`. Given source-code is present and test-data.anonymization is selected, it passes only when the repository binding evaluates test-data.anonymization and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. Evidence is recorded against `fixture:testing.test-data.anonymization:policy-boundary`; absence never becomes a pass.
