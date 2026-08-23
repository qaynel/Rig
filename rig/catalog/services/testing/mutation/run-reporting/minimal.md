# testing.mutation.run-reporting - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`run-reporting-source-code-boundary` owns `mutation.run-reporting`. Given source-code is present and mutation.run-reporting is selected, it passes only when the repository binding evaluates mutation.run-reporting and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. Evidence is recorded against `fixture:testing.mutation.run-reporting:policy-boundary`; absence never becomes a pass.
