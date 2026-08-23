# testing.test-data.synthetic-data - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`synthetic-data-source-code-boundary` owns `test-data.synthetic-data`. Given source-code is present and test-data.synthetic-data is selected, it passes only when the repository binding evaluates test-data.synthetic-data and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. Evidence is recorded against `fixture:testing.test-data.synthetic-data:policy-boundary`; absence never becomes a pass.
