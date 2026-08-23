# testing.mutation.ci-gate-policy - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`ci-gate-policy-source-code-boundary` owns `mutation.ci-gate-policy`. Given source-code is present and mutation.ci-gate-policy is selected, it passes only when the repository binding evaluates mutation.ci-gate-policy and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. Evidence is recorded against `fixture:testing.mutation.ci-gate-policy:policy-boundary`; absence never becomes a pass.
