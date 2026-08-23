# testing.regression.change-impact - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`change-impact-source-code-boundary` owns `regression.change-impact`. Given source-code is present and regression.change-impact is selected, it passes only when the repository binding evaluates regression.change-impact and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern. Evidence is recorded against `fixture:testing.regression.change-impact:policy-boundary`; absence never becomes a pass.
