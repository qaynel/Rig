# testing.mutation.selector-sampler - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`selector-sampler-source-code-boundary` owns `mutation.selector-sampler`. Given source-code is present and mutation.selector-sampler is selected, it passes only when the repository binding evaluates mutation.selector-sampler and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. Evidence is recorded against `fixture:testing.mutation.selector-sampler:policy-boundary`; absence never becomes a pass.
