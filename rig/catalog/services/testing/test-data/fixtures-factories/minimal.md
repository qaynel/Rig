# testing.test-data.fixtures-factories - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`fixtures-factories-source-code-boundary` owns `test-data.fixtures-factories`. Given source-code is present and test-data.fixtures-factories is selected, it passes only when the repository binding evaluates test-data.fixtures-factories and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. Evidence is recorded against `fixture:testing.test-data.fixtures-factories:policy-boundary`; absence never becomes a pass.
