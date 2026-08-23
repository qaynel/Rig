# testing.mutation.mutant-generator - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`mutant-generator-source-code-boundary` owns `mutation.mutant-generator`. Given source-code is present and mutation.mutant-generator is selected, it passes only when the repository binding evaluates mutation.mutant-generator and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. Evidence is recorded against `fixture:testing.mutation.mutant-generator:policy-boundary`; absence never becomes a pass.
