# testing.mutation.equivalent-mutant-detector - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`equivalent-mutant-detector-source-code-boundary` owns `mutation.equivalent-mutant-detector`. Given source-code is present and mutation.equivalent-mutant-detector is selected, it passes only when the repository binding evaluates mutation.equivalent-mutant-detector and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. Evidence is recorded against `fixture:testing.mutation.equivalent-mutant-detector:policy-boundary`; absence never becomes a pass.
