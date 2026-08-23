# testing.mutation.survivor-rca - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`survivor-rca-source-code-boundary` owns `mutation.survivor-rca`. Given source-code is present and mutation.survivor-rca is selected, it passes only when the repository binding evaluates mutation.survivor-rca and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. Evidence is recorded against `fixture:testing.mutation.survivor-rca:policy-boundary`; absence never becomes a pass.
